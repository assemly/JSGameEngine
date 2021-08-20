class A { 
    constructor(name) {
        this.name = name;
        this.notify = this.notify.bind(this);
     }
    notifyA() { 
        alert(this.name)
    console.log("AAA") }
    notify() { 
        alert(this.name)
    console.log("AAA") }
}
export {A}