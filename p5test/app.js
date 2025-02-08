document.addEventListener("DOMContentLoaded", () => {
    const eventEmitter = new EventEmitter();  // 创建事件管理器实例
    const model = new OXOModel();
    const view = new OXOView(eventEmitter);   // 将事件管理器传入视图
    const controller = new OXOController(model, eventEmitter);  // 将事件管理器传入控制器

    model.addObserver(view);  // `view` 作为观察者监听 `model` 变化

    view.bindBoardClick();  // 视图绑定事件
    view.bindInput();       // 视图绑定输入事件
});
