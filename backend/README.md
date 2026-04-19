# Бэкенд блога ☕

REST API на Spring Boot для приложения блога.

## 🚀 Стек технологий
- **Фреймворк**: Spring Boot 3
- **Язык**: Java 17
- **Безопасность**: Spring Security + JWT
- **База данных**: PostgreSQL
- **Сборщик**: Maven

## 🛠 Разработка

### Локальный запуск
Если у вас установлены Java 17 и Maven, вы можете запустить бэкенд без Docker:
```bash
./mvnw spring-boot:run
```
*Примечание: Убедитесь, что запущен экземпляр PostgreSQL на порту 5432.*

### Сборка Jar-файла
```bash
./mvnw clean package -DskipTests
```

## 🔌 API Эндпоинты
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Авторизация пользователя
- `GET /api/posts` - Список всех постов
- `POST /api/posts` - Создание поста (требуется авторизация)

## ⚙️ Конфигурация
Используемые переменные окружения (см. `application.yml`):
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
