interface IPersona{
    nombre: string;
    edad: number;
    amigos: object[];
}

const pene: IPersona ={
    nombre: "Pene",
    edad: 20,
    amigos: [{n: "Juan", e: 20}, {n: "Pedro", e: 21},],
}
const cimbrel: IPersona ={
    nombre: "Pene",
    edad: 20,
    amigos: [{n: "Juan", e: 20}, {n: "Pedro", e: 21},],
}

interface IFuncionario{
    dni: string;
    nombre: string;
    puesto: string;
    salario: number;
}

const luispergen: IFuncionario ={
    dni: "045678732F",
    nombre: "Luis",
    puesto: "Aspergen",
    salario: 300,
}

function deepPrint(obj:Object){

    for(let i:number = 0; i < Object.keys(obj).length; i++){
        if(Array.isArray(Object.values(obj)[i])){
            console.log(`${Object.keys(obj)[i]}:`);
            deepPrint(Object.values(obj)[i]);
        }else{
            console.log(`${Object.keys(obj)[i]}`, Object.values(obj)[i]);
        }
    }
    
}

function deepClone(obj:Object){
    if(typeof obj === "object"){
        let obj_clone:any = Array.isArray(obj)?[]:{};

        for(let atr:number = 0; atr < Object.keys(obj).length; atr++){
            obj_clone[Object.keys(obj)[atr]] = deepClone(Object.values(obj)[atr]);
        }
        return obj_clone;
    }else {
        return obj;
    }
}

function deepEquals(obj1:Object, obj2:Object){
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    const val1 = Object.values(obj1);
    const val2 = Object.values(obj2);

    if(obj1 === obj2){
        return true;
    }
    else if((typeof obj1 == "object" && obj1 != null) && (typeof obj2 == "object" && obj2 != null)){
        if(keys1.length !== keys2.length){
            return false;
        }

        for(let i:number = 0; i < keys1.length; i++){
            if(!deepEquals(val1[i], val2[i])){
                return false;
            }
        }
        return true;
    }else{
        return false;
    }
}

console.log("--------------------------------------*");
deepPrint(cimbrel);
console.log("--------------------------------------*");
console.log(deepClone(cimbrel));
console.log("--------------------------------------*");
console.log(deepEquals(pene,cimbrel));
console.log("--------------------------------------*");
