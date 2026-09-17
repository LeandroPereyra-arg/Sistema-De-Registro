-- Crear la base de datos (si no existe)
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'Ecomers-db')
BEGIN
    CREATE DATABASE Ecomers;
END
GO

USE DAS_Tarjetas;
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tarjetas')
BEGIN
    CREATE TABLE Tarjetas (
        id          INT IDENTITY(1,1) PRIMARY KEY,    
        codigo      VARCHAR(50) NOT NULL,            
        nombre      VARCHAR(150) NOT NULL,             
        descripcion NVARCHAR(MAX) NULL,                
        talle       VARCHAR(20) NULL,                 
        precio      DECIMAL(10,2) NOT NULL DEFAULT 0,  
        stock       INT NOT NULL DEFAULT 0,            
        imagen      VARCHAR(255) NULL                  
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Usuarios')
BEGIN
    CREATE TABLE Usuarios (
        id          INT IDENTITY(1,1) PRIMARY KEY,
        usuario     VARCHAR(50) NOT NULL UNIQUE,
        email       VARCHAR(150) NOT NULL UNIQUE,
        password    VARCHAR(255) NOT NULL,             -- Hash de bcrypt
        rol         VARCHAR(20) NOT NULL DEFAULT 'usuario',
        creado      DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO
