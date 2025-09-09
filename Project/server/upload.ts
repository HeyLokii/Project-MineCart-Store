import multer from 'multer';
import path from 'path';
import fs from 'fs';
import express, { Request, Response } from 'express';

// Configuração do multer para upload de avatares
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `avatar-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Configuração do multer para upload de imagens de produtos
const productImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `product-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Configuração do multer para upload de arquivos de produtos
const productFileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'files');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `file-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const avatarUpload = multer({ 
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'));
    }
  }
});

const productImageUpload = multer({ 
  storage: productImageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'));
    }
  }
});

const productFileUpload = multer({ 
  storage: productFileStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    // Extensões permitidas
    const allowedExtensions = ['.zip', '.rar', '.mcaddon', '.mcpack', '.mcworld'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    console.log(`🔍 Verificando arquivo: ${file.originalname}, extensão: ${fileExtension}`);
    
    if (allowedExtensions.includes(fileExtension)) {
      console.log(`✅ Extensão ${fileExtension} é permitida`);
      return cb(null, true);
    } else {
      console.log(`❌ Extensão ${fileExtension} não é permitida. Permitidas: ${allowedExtensions.join(', ')}`);
      cb(new Error(`Apenas arquivos ZIP, RAR, MCADDON, MCPACK, MCWORLD são permitidos`));
    }
  }
});

export const handleAvatarUpload = (req: any, res: any) => {
  avatarUpload.single('avatar')(req, res, async (err) => {
    if (err) {
      console.error('❌ Erro no upload do avatar:', err);
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado' });
    }

    try {
      const sharp = require('sharp');
      const path = require('path');
      const fs = require('fs');

      console.log(`📸 Processando avatar: ${req.file.filename}, tamanho: ${(req.file.size / 1024).toFixed(1)}KB`);

      // Validar dimensões da imagem
      const metadata = await sharp(req.file.path).metadata();
      const minDimension = 100;

      if (metadata.width && metadata.height) {
        if (metadata.width < minDimension || metadata.height < minDimension) {
          // Remover arquivo inválido
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ 
            success: false, 
            message: `Dimensões muito pequenas: ${metadata.width}x${metadata.height}px. Mínimo: ${minDimension}x${minDimension}px` 
          });
        }
      }

      // Gerar nome otimizado
      const timestamp = Date.now();
      const webpFilename = `avatar-${timestamp}-optimized.webp`;
      const webpPath = path.join(process.cwd(), 'uploads', 'avatars', webpFilename);

      // Processar imagem com sharp - múltiplos tamanhos
      await sharp(req.file.path)
        .resize(300, 300, { 
          fit: 'cover',
          position: 'center'
        })
        .webp({ 
          quality: 90,
          effort: 6 
        })
        .toFile(webpPath);

      // Criar thumbnail menor para uso em listas
      const thumbFilename = `avatar-${timestamp}-thumb.webp`;
      const thumbPath = path.join(process.cwd(), 'uploads', 'avatars', thumbFilename);
      
      await sharp(req.file.path)
        .resize(64, 64, { 
          fit: 'cover',
          position: 'center'
        })
        .webp({ 
          quality: 85,
          effort: 6 
        })
        .toFile(thumbPath);

      // Remover arquivo original
      fs.unlinkSync(req.file.path);

      const fileUrl = `/uploads/avatars/${webpFilename}`;
      const thumbUrl = `/uploads/avatars/${thumbFilename}`;

      console.log(`✅ Avatar processado: ${webpFilename} (${metadata.width}x${metadata.height} → 300x300)`);

      res.json({ 
        success: true, 
        url: fileUrl,
        thumbUrl: thumbUrl,
        originalDimensions: `${metadata.width}x${metadata.height}`,
        optimizedSize: '300x300',
        message: 'Avatar enviado e otimizado com sucesso!' 
      });
    } catch (error) {
      console.error('❌ Erro ao processar avatar:', error);
      
      // Fallback - usar arquivo original se processamento falhar
      try {
        const fileUrl = `/uploads/avatars/${req.file.filename}`;
        res.json({ 
          success: true, 
          url: fileUrl,
          message: 'Avatar enviado com sucesso (sem otimização)!' 
        });
      } catch (fallbackError) {
        console.error('❌ Erro no fallback:', fallbackError);
        res.status(500).json({ 
          success: false, 
          message: 'Erro interno no processamento da imagem' 
        });
      }
    }
  });
};

export const handleProductImageUpload = (req: Request, res: Response) => {
  productImageUpload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Erro no upload da imagem do produto:', err);
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'Erro no upload da imagem' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nenhum arquivo foi enviado' 
      });
    }

    const fileUrl = `/uploads/products/${req.file.filename}`;

    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  });
};

export const handleProductFileUpload = (req: Request, res: Response) => {
  productFileUpload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Erro no upload do arquivo do produto:', err);
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'Erro no upload do arquivo' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nenhum arquivo foi enviado' 
      });
    }

    const fileUrl = `/uploads/files/${req.file.filename}`;

    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  });
};

export const setupUploadRoutes = (app: any) => {
  // Configurar servir arquivos estáticos das pastas de upload
  app.use('/uploads/avatars', express.static(path.join(process.cwd(), 'uploads', 'avatars')));
  app.use('/uploads/products', express.static(path.join(process.cwd(), 'uploads', 'products')));
  app.use('/uploads/files', express.static(path.join(process.cwd(), 'uploads', 'files')));

  console.log('✅ Rotas de upload configuradas');
};