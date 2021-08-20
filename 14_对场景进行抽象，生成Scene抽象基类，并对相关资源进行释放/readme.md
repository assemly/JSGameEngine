# Scene抽象基类
## 1.抽象场景生成Scene抽象基类
```
class Scene {
    constructor() {
        if (new.target === Scene) {
            throw new Error("Scene::You cant create Scene instances");
        }
    }

    // Begin Scene: must load all the scene contents
    // when done 
    //  => start the GameLoop
    // The game loop will call initialize and then Update/draw
    loadScene() {
        throw new Error("Scene::You have to implement the method loadScene!");// override to load scene specific contents
    };
    ....
```
> 因为JavaScript没有抽象方法，所以通过异常生成抽象基类

## 释放场景资源unloadScene
+ 随着场景切换，一些预留在场景中的资源需要释放
+ 资源释放可以避免一些渲染对象在场景中

## 修复MapEntry中一些问题
