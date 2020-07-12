class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;

    Dep.target = this;
    this.oldVal = this.getVal();
    Dep.target = null;
  }

  getVal() {
    return compileUtil.getVal(this.expr, this.vm);
  }

  update() {
    let newVal = this.getVal();
    if (newVal !== this.oldVal) {
      this.cb(newVal);
    }
  }
}

class Dep {
  constructor() {
    this.subs = [];
  }

  addSub(watcher) {
    this.subs.push(watcher);
  }

  notify() {
    this.subs.forEach((w) => w.update());
  }
}

class Observer {
  constructor(data) {
    this.observer(data);
  }

  observer(data) {
    if (data && typeof data === "object") {
      Object.keys(data).forEach((key) => {
        this.defineReactive(data, key, data[key]);
      });
    }
  }

  defineReactive(data, key, val) {
    this.observer(val);
    const dep = new Dep();

    Object.defineProperty(data, key, {
      get() {
        // 订阅数据变化时，往Dep中添加观察者
        Dep.target && dep.addSub(Dep.target);

        return val;
      },
      set: (newVal) => {
        this.observer(newVal);
        if (newVal !== val) {
          val = newVal;

          // 通知watcher变化
          dep.notify();
        }
      },
    });
  }
}
