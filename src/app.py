from flask import Flask, request, jsonify, send_from_directory
import os
from flask_migrate import Migrate
from flask_swagger import swagger

from flask_jwt_extended import create_access_token
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash  # Solución para hashear contraseña, y asegurar que no se guarden en texto plano. 
from werkzeug.security import check_password_hash
from flask import Blueprint, request, jsonify

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

CORS(app, resources={r"/*": {"origins": "*"}})

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

app.config["JWT_SECRET_KEY"] = os.getenv("HS3K72B3AH12KZY")
jwt = JWTManager(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response

#Login
@app.route('/login', methods=['POST'])
def login():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({"msg":"Debes enviar información en el body"}), 400
    email = request.json.get('email')
    password = request.json.get('password')
    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Email o contraseña incorrecto"}), 401
    
    #access_token = create_access_token(identity=str(user.id),additional_claims=additional_claims)# Modifique porque create_acces_token necesita un valor que se serialize como un string por ej. 
    access_token = create_access_token(identity=str(user.id))
    print(user.serialize())
    print(f"Token JWT:{access_token} ")
    return jsonify({"access_token":access_token}), 200

#Logout
@app.route('/logout', methods=['POST'])
def logout():
  auth_header = request.headers.get('Authorization')
  if not auth_header:
    return jsonify({'message': 'Missing authorization header'}), 401
  try:
    token_type, token = auth_header.split(maxsplit=1)
    if token_type.lower() != 'bearer':
      return jsonify({'message': 'Invalid authorization type'}), 401
  except ValueError:
    return jsonify({'message': 'Invalid authorization header'}), 401
  return jsonify({'message': 'Successfully logged out'}), 200

#Signup
@app.route('/registro', methods=['POST'])
def register():
    try:
        # Obtener los datos del body
        body = request.get_json(silent=True)
        if body is None:
            return jsonify({"msg": "Debes enviar información en el body"}), 400

        email = body.get('email')
        password = body.get('password')

        # Validar campos requeridos
        fields = ["email", "password"]
        for field in fields:
            if not locals()[field]:
                return jsonify({"msg": f"El campo {field} es obligatorio"}), 400

        # Verificar si el email ya está en uso
        if User.query.filter_by(email=email).first():
            return jsonify({"msg": "Email ya está en uso"}), 400

        # Hashear la contraseña y crear nuevo usuario
        hashed_password = generate_password_hash(password)
        new_user = User(email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "email": new_user.email,
            "msg": "Usuario registrado exitosamente"
        }), 201

    except Exception as e:
        print("Error en /registro:", e)
        return jsonify({"msg": "Error interno del servidor", "error": str(e)}), 500


# Manejar solicitudes OPTIONS para CORS
@app.route('/registro', methods=['OPTIONS'])
def handle_options():
    response = jsonify({"msg": "OK"})
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response, 204


# Asegurar que todas las respuestas incluyan los encabezados CORS
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({"msg": "Debes enviar información en el body"}), 400

    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify(user.serialize()), 200

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)