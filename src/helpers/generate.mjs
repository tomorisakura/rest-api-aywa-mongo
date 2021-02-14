export function Uniqname (name, number){
    try {
        const char = name.split(' ');
        const num = number.split('');
        let arr = [];

        for (let i = 0; i < num.length; i++) {
            
            if(i > 8) {
                arr.push(num[i])
            }
            arr.push(char[i]);
        }

        const result = Array.from(arr).join('');
        return result.toLocaleLowerCase();

    } catch (error) {
        throw error;
    }
}

export function Uniqpet(name) {
    try {
        let arr = [];
        const random = String(Math.random() * 100);
        const result = random.split('');
        console.log(result.length);
        arr.push(name);
        for (let i = 0; i < result.length; i++) {
            if(i > 10) {
                arr.push(result[i]);
            }
        }

        const uniq = Array.from(arr).join('');
        console.log(uniq);
        return uniq.toLowerCase();
        
    } catch (error) {
        throw error;
    }
}