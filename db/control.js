
const email_control = (value) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const control = regex.test(value);
    if(control == true){
        return 1;
    }
    return -1;
}

const password_control = (value) => {
    const regex = /\s/;
    const regex2 = /[#`;'+=-]/;;
    if(regex.test(value)) {
        return -2;
    }
    else if(value.length < 5) { 
        return -1;
    }else if(regex2.test(value)) {
        return -3;
    }
    return 1;
}

module.exports = {
    email_control,
    password_control
}

