function Person(gender) {
  this.gender = gender;
  console.log("person function");
  console.log(this);
}

 Person.prototype.hello = "this is";

var User = {};

User = function() {
  console.log("this");
  console.log(this);
};
(function() {
  var classUser = User();
  console.log("User function");
  console.log(classUser);
})();

(function() {
  var classPerson = Person.prototype;
  console.log("person iify");
  console.log(classPerson);
  
})();

var p1 = new Person('male');

console.log(p1.gender);

console.log(this);