export function debounce(func: Function, delay: number): Function {
    let timer: number = -1;
    return (_this: any, ...args: any) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.call(_this, ...args);
        }, delay);
    }
}
