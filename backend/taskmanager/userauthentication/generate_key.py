import secrets
import os
from pathlib import Path

def generate_jwt_key():
    # Generate a secure random key
    key = secrets.token_hex(32)
    
    # Path to the .env file
    env_path = Path('.env')
    
    # If .env exists, update it. If not, create it.
    if env_path.exists():
        with open(env_path, 'r') as file:
            lines = file.readlines()
        
        # Check if JWT_SECRET_KEY already exists
        key_exists = False
        for i, line in enumerate(lines):
            if line.startswith('JWT_SECRET_KEY='):
                lines[i] = f'JWT_SECRET_KEY={key}\n'
                key_exists = True
                break
        
        if not key_exists:
            lines.append(f'JWT_SECRET_KEY={key}\n')
        
        with open(env_path, 'w') as file:
            file.writelines(lines)
    else:
        with open(env_path, 'w') as file:
            file.write(f'JWT_SECRET_KEY={key}\n')
    
    return key

if __name__ == "__main__":
    key = generate_jwt_key()
    print(f"Generated JWT secret key: {key}")
    print("This key has been saved to your .env file")