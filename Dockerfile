# ---- build ----
    FROM node:20-alpine AS build

    WORKDIR /app
    
    COPY package*.json ./
    RUN npm ci
    
    COPY . .
    RUN npm run build
    
    # ---- nginx ----
    FROM nginx:alpine
    
    # Удаляем дефолтный конфиг
    RUN rm /etc/nginx/conf.d/default.conf
    
    # Копируем свой конфиг
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Копируем билд
    COPY --from=build /app/build /usr/share/nginx/html
    
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    