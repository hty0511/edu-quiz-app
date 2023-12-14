upstream express_api {
    server ${API_HOST}:${API_PORT};
}

server {
    listen ${LISTEN_PORT};

    location /express-static {
        alias /vol/express_static;
    }

    location /api {
        proxy_pass http://express_api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        root /vol/react_static;
        try_files $uri /index.html;
    }
}
