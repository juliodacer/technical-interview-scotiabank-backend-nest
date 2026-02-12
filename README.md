# API de Gestión de Productos - Scotiabank

API RESTful desarrollada con NestJS para la gestión de productos bancarios y sus categorías.

## Descripción

Sistema backend que permite administrar un catálogo de productos bancarios (tarjetas de crédito, cuentas de ahorro, préstamos, etc.) organizados por categorías. Incluye funcionalidades de búsqueda avanzada con normalización de texto para búsquedas insensibles a acentos y mayúsculas.

## Características Principales

- ✅ CRUD completo de productos y categorías
- ✅ Búsqueda flexible por nombre de producto (insensible a acentos/mayúsculas)
- ✅ Filtros por categoría y estado
- ✅ Paginación de resultados
- ✅ Validación de datos con class-validator
- ✅ Persistencia con PostgreSQL y TypeORM
- ✅ Código limpio siguiendo principios SOLID y DRY

## Stack Tecnológico

- **Framework**: NestJS 11.x
- **Lenguaje**: TypeScript 5.x
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM 0.3.x
- **Validación**: class-validator & class-transformer
- **Testing**: Jest

## Modelo de Datos

### Producto
```typescript
{
  id: number
  code: string         // Código único (ej: TCC0001)
  name: string         // Nombre del producto
  description: string  // Descripción detallada
  price: decimal       // Precio del producto
  state: boolean       // Activo/Inactivo
  reg_date: timestamp  // Fecha de registro
  mod_date: timestamp  // Fecha de modificación
  category: Category   // Categoría asociada
}
```

### Categoría
```typescript
{
  id: number
  name: string        // Nombre de la categoría
  products: Product[] // Productos asociados
}
```

## Endpoints de la API

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Lista productos con filtros y paginación |
| GET | `/api/products/:id` | Obtiene un producto por ID |
| POST | `/api/products` | Crea un nuevo producto |
| PATCH | `/api/products/:id` | Actualiza un producto |
| DELETE | `/api/products/:id` | Elimina un producto |

### Categorías

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/categories` | Lista todas las categorías |
| GET | `/api/categories/:id` | Obtiene una categoría por ID |
| POST | `/api/categories` | Crea una nueva categoría |
| PATCH | `/api/categories/:id` | Actualiza una categoría |
| DELETE | `/api/categories/:id` | Elimina una categoría |

## Parámetros de Búsqueda

El endpoint `GET /api/products` soporta los siguientes query parameters:

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `q` | string | Búsqueda por nombre del producto | `?q=clasica` |
| `category` | string | Filtro por nombre de categoría | `?category=tarjeta` |
| `state` | boolean | Filtro por estado (true/false) | `?state=true` |
| `page` | number | Número de página (default: 1) | `?page=2` |
| `size` | number | Elementos por página (default: 10, max: 100) | `?size=20` |

### Ejemplos de Uso

```bash
# Listar todos los productos (paginado)
GET /api/products

# Buscar productos por nombre
GET /api/products?q=clasica

# Filtrar por categoría
GET /api/products?category=tarjeta

# Buscar con múltiples filtros
GET /api/products?q=credito&category=tarjeta&state=true&page=1&size=10

# Obtener un producto específico
GET /api/products/1
```

## Configuración del Proyecto

### Prerrequisitos

- Node.js >= 18.x
- PostgreSQL >= 12.x
- pnpm (recomendado) o npm

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
DATABASE_HOST=tu_host_postgres
DATABASE_PORT=5432
DATABASE_USER=tu_usuario
DATABASE_PASS=tu_contraseña
DATABASE_NAME=scotiabank_products_db
CORS_ORIGIN=*
```

### Instalación

```bash
# Instalar dependencias
pnpm install

# o con npm
npm install
```

### Ejecutar la Aplicación

```bash
# Modo desarrollo (con hot-reload)
pnpm run start:dev

# Modo producción
pnpm run start:prod

# Modo debug
pnpm run start:debug
```

La API estará disponible en `http://localhost:3003`

## Testing

```bash
# Ejecutar tests unitarios
pnpm run test

# Tests en modo watch
pnpm run test:watch

# Tests con cobertura
pnpm run test:cov

# Tests e2e
pnpm run test:e2e
```

## Linting y Formato

```bash
# Ejecutar linter
pnpm run lint

# Formatear código
pnpm run format
```

## Estructura del Proyecto

```
src/
├── categories/           # Módulo de categorías
│   ├── dto/             # Data Transfer Objects
│   ├── entities/        # Entidades TypeORM
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── categories.module.ts
├── products/            # Módulo de productos
│   ├── dto/             # Data Transfer Objects
│   ├── entities/        # Entidades TypeORM
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── commons/             # Utilidades compartidas
│   ├── pipes/           # Pipes de validación
│   └── utils/           # Funciones utilitarias
│       ├── text-normalizer.util.ts
│       └── text-normalizer.util.spec.ts
├── config/              # Configuraciones
│   └── typeorm.config.ts
├── app.module.ts        # Módulo raíz
└── main.ts             # Punto de entrada
```

## Características Técnicas Destacadas

### Búsqueda con Normalización de Texto

El sistema implementa búsqueda flexible usando la función `TRANSLATE()` de PostgreSQL para normalizar caracteres con acentos:

- **"credito"** encuentra **"Crédito"**
- **"clasica"** encuentra **"Clásica"**
- **"nono"** encuentra **"Ñoño"**

### Principios de Clean Code

- **DRY**: Lógica reutilizable en funciones utilitarias
- **SRP**: Cada método tiene una única responsabilidad
- **Separation of Concerns**: Filtros separados en métodos privados
- **Type Safety**: Uso de TypeScript con tipos explícitos

## Ejemplo de Respuesta

```json
{
  "products": [
    {
      "id": 6,
      "code": "TCC0006",
      "name": "Tarjeta de Crédito Clásica",
      "description": "Tarifa preferencial y cuotas sin interés.",
      "price": "0.00",
      "reg_date": "2026-02-12T18:18:19.921Z",
      "mod_date": null,
      "state": true,
      "category": "Tarjeta"
    }
  ],
  "total": 1,
  "page": 1
}
```

## Licencia

UNLICENSED - Proyecto privado para entrevista técnica Scotiabank
