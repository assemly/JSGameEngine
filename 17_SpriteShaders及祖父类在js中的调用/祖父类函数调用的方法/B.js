import {A} from "./A";
class B extends A { 
    constructor(name) {
        super(name);
     }
    notifyB() { 
        alert("B") 
    
}
}
export {B}