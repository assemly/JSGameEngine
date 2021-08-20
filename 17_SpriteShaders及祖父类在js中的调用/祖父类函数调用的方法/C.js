import {B} from "./B";
import {A} from "./A";
class C extends B { 
    constructor(name) {
        super(name);
        this.name = name;
     }
    notify() { alert("C") }
    //调用祖父类方法1
    callA() {
        this.notify();  
        console.log(super.__proto__.__proto__.__proto__)
         
        super.__proto__.__proto__.__proto__.notify.call(this);
    }
    //调用祖父类方法2
    callAA() {
        console.log("A.prototype: ");
        console.log(A.prototype);
        console.log("super.__proto__");
        console.log(super.__proto__.__proto__.__proto__);
        console.log((super.__proto__.__proto__.__proto__) === A.prototype);
        A.prototype.notify.call(this);
        }
}
export {C}