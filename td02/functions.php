
// Fonction isPrime(nombre) -> booléen
function isPrime(num) {
  var sqrtnum=Math.floor(Math.sqrt(num));
    var prime = num != 1;
    for(var i=2; i<sqrtnum; i++) {
        if(num % i == 0) {
            prime = false;
            break;
        }
    }
    return prime;
}