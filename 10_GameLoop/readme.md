# 分离 Shader 文件

## 1.webpack 配置支持glsl

```
     // Shaders
        {
          test: /\.(glsl|vs|fs|vert|frag)$/,
          exclude: /node_modules/,
          use: [
              'raw-loader'
          ]
        }
```

## 2.css样式添加
    消除边框  

## 3.封装webgl 片元颜色  
