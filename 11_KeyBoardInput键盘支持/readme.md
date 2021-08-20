# Input

## 1.Input 按键常量 前状态、按下、释放监听
```
    window.addEventListener('keyup', (event)=>this._onKeyUp(event));
    window.addEventListener('keydown',(event)=>this._onKeyDown(event));
```
 使用箭头函数用于继承上下文，箭头函数没有this,所以能把class中this带入进去

## 2.Engine种添加Input类

## 3.Core中添加对Input支持

## 4.GameLoop中更新Input状态

## 5.MyGame中进行测试
