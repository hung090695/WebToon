from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime
import requests
import time
import threading
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)  # Cho phép kết nối từ React frontend

# Cấu hình cơ sở dữ liệu
DB_NAME = 'user_manga.db'

# Kết nối cơ sở dữ liệu SQLite
def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

# Tạo các bảng trong cơ sở dữ liệu
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS manga (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            cover_image TEXT,
            content TEXT
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS manga_reading_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            manga_title TEXT NOT NULL,
            last_read_at TEXT NOT NULL,
            cover_image TEXT,
            content TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    conn.commit()
    conn.close()

# API đăng ký tài khoản
@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.json
    username = data['username']
    password = data['password']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, password))
        conn.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username is already taken"}), 400
    finally:
        conn.close()

# API đăng nhập
@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.json
    username = data['username']
    password = data['password']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, password))
    user = cursor.fetchone()
    conn.close()
    
    if user:
        return jsonify({"user_id": user['id'], "username": user['username']}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

# API thêm manga vào lịch sử đọc
@app.route('/api/add-manga', methods=['POST'])
def add_manga():
    data = request.json
    user_id = data['user_id']
    manga_title = data['manga_title']
    cover_image = data.get('cover_image', '')  # Đường dẫn bìa
    content = data.get('content', '')          # Nội dung manga
    last_read_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # Thời gian đọc manga
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO manga_reading_history 
        (user_id, manga_title, last_read_at, cover_image, content) 
        VALUES (?, ?, ?, ?, ?)
    ''', (user_id, manga_title, last_read_at, cover_image, content))
    conn.commit()
    conn.close()
    
    return jsonify({"message": f"'{manga_title}' added to your reading history"}), 201

# API lấy lịch sử đọc manga của người dùng
@app.route('/api/manga-history/<int:user_id>', methods=['GET'])
def get_manga_history(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT manga_title, last_read_at, cover_image, content 
        FROM manga_reading_history 
        WHERE user_id = ?
    ''', (user_id,))
    history = cursor.fetchall()
    conn.close()
    
    if history:
        return jsonify([{
            "manga_title": row["manga_title"],
            "last_read_at": row["last_read_at"],
            "cover_image": row["cover_image"],
            "content": row["content"]
        } for row in history]), 200
    else:
        return jsonify({"message": "No manga history found"}), 404

# API xóa manga khỏi lịch sử đọc
@app.route('/api/delete-manga-history', methods=['DELETE'])
def delete_manga_history():
    data = request.json
    user_id = data['user_id']
    manga_title = data['manga_title']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM manga_reading_history WHERE user_id = ? AND manga_title = ?', (user_id, manga_title))
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Manga removed from history"}), 200

# Chức năng tải manga từ MangaDex
def fetch_and_save_manga_from_mangadex():
    base_url = "https://api.mangadex.org"

    try:
        # Lấy danh sách manga
        response = requests.get(f"{base_url}/manga", params={"limit": 100})
        response.raise_for_status()

        mangas = response.json().get("data", [])

        conn = get_db_connection()
        cursor = conn.cursor()

        for manga in mangas:
            title = manga["attributes"]["title"].get("en", "").strip()
            description = manga["attributes"]["description"].get("en", "").strip()

            if not title or not description:
                print(f"Skipping manga due to missing title or description: {manga['id']}")
                continue

            manga_id = manga["id"]
            cover_response = requests.get(f"{base_url}/cover", params={"manga[]": manga_id})
            cover_image = ""
            if cover_response.status_code == 200:
                covers = cover_response.json().get("data", [])
                if covers:
                    cover_file = covers[0]["attributes"]["fileName"]
                    cover_image = f"https://uploads.mangadex.org/covers/{manga_id}/{cover_file}"

            if not cover_image:
                print(f"Skipping manga due to missing cover image: {title}")
                continue

            cursor.execute('SELECT COUNT(*) FROM manga WHERE title = ?', (title,))
            exists = cursor.fetchone()[0] > 0

            if not exists:
                cursor.execute('''
                    INSERT INTO manga (title, cover_image, content)
                    VALUES (?, ?, ?)
                ''', (title, cover_image, description))
                print(f"Added manga: {title}")
            else:
                print(f"Manga already exists: {title}")

        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error fetching manga: {e}")

# Chạy cập nhật manga trong một luồng riêng biệt
def continuously_update_manga(interval=60):
    while True:
        fetch_and_save_manga_from_mangadex()
        print(f"Waiting for {interval} seconds before fetching new manga...")
        time.sleep(interval)

# API để lấy thông tin manga (bao gồm bìa và nội dung)
@app.route('/api/manga-details/<int:manga_id>', methods=['GET'])
def get_manga_details(manga_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT title, cover_image, content FROM manga WHERE id = ?', (manga_id,))
    manga = cursor.fetchone()
    conn.close()
    
    if manga:
        return jsonify({
            "title": manga["title"],
            "cover_image": manga["cover_image"],
            "content": manga["content"]
        }), 200
    else:
        return jsonify({"message": "Manga not found"}), 404

# API đề xuất manga dựa trên lịch sử đọc của người dùng
@app.route('/api/recommend-manga/<int:user_id>', methods=['GET'])
def recommend_manga(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT manga_title, content 
        FROM manga_reading_history 
        WHERE user_id = ?
    ''', (user_id,))
    user_history = cursor.fetchall()

    if not user_history:
        return jsonify({"message": "No reading history found for this user."}), 404

    user_read_contents = [item['content'] for item in user_history]
    read_titles = {item['manga_title'] for item in user_history}

    cursor.execute('SELECT id, title, content, cover_image FROM manga')
    all_manga = cursor.fetchall()
    conn.close()

    if not all_manga:
        return jsonify({"message": "No manga found in the database."}), 404

    manga_titles = [manga['title'] for manga in all_manga]
    manga_contents = [manga['content'] for manga in all_manga]

    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(user_read_contents + manga_contents)

    user_vector = tfidf_matrix[:len(user_read_contents)]
    manga_vectors = tfidf_matrix[len(user_read_contents):]

    similarities = cosine_similarity(user_vector, manga_vectors)

    recommended = []
    for idx, manga in enumerate(all_manga):
        if manga['title'] not in read_titles:
            similarity_score = max(similarities[:, idx])
            if similarity_score > 0.05:
                recommended.append({
                    "manga_title": manga['title'],
                    "cover_image": manga['cover_image'],
                    "content": manga['content'],
                    "similarity_score": similarity_score
                })

    recommended = sorted(recommended, key=lambda x: x['similarity_score'], reverse=True)

    if recommended:
        return jsonify(recommended[:5]), 200
    else:
        return jsonify({"message": "No recommendations found based on your history."}), 404

# API tìm manga theo cảm xúc
emotion_keywords = {
    "happy": ["joy", "happy", "exciting", "cheerful", "delightful"],
    "sad": ["tragic", "emotional", "heartbreaking", "sorrowful", "melancholic"],
    "angry": ["furious", "rage", "angry", "upset", "frustrated"],
    "surprised": ["surprising", "unexpected", "amazing", "astonishing", "shocking"],
    "funny": ["humor", "funny", "comedy", "hilarious", "laugh"]
}

@app.route('/api/search-by-emotion', methods=['GET'])
def search_by_emotion():
    emotion = request.args.get('emotion', '').lower()
    if not emotion:
        return jsonify({"error": "Emotion parameter is required"}), 400

    keywords = emotion_keywords.get(emotion)
    if not keywords:
        return jsonify({"error": "Invalid emotion"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT title, content, cover_image FROM manga")
    manga_data = cursor.fetchall()
    conn.close()

    seen_titles = set()
    result = [
        {
            "title": manga[0],
            "content": manga[1],
            "cover_image": manga[2],
        }
        for manga in manga_data
        if any(re.search(rf"\b{keyword}\b", manga[1], re.IGNORECASE) for keyword in keywords)
        and manga[0] not in seen_titles and not seen_titles.add(manga[0])
    ]

    if not result:
        return jsonify({"error": "No manga found matching the emotion"}), 404

    return jsonify(result), 200

@app.route('/api/mangadex', methods=['GET'])
def proxy_mangadex():
    endpoint = request.args.get('endpoint')
    mangadex_url = f"https://api.mangadex.org/{endpoint}"
    response = requests.get(mangadex_url, params=request.args)
    return jsonify(response.json())

if __name__ == '__main__':
    init_db()
    updater_thread = threading.Thread(target=continuously_update_manga, args=(60,), daemon=True)
    updater_thread.start()
    app.run(debug=True)
