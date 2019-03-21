console.warn('hello world');
const NUMBER_OF_USERS = 7; // According to 
const NUMBER_OF_OBJECTS = 4;
const header = [
    'Объект / субъект',
];
const objects = [];
const users = [];
const generatePermissions = (permissions, NUMBER_OF_OBJECTS) => {
    for (object in NUMBER_OF_OBJECTS) {
        permissions.push(Math.random() * Math.floor(3));
    }
};

class User {
    constructor(name, ...permissions) {
        this.name = name,
        this.permissions = [...permissions];
    };
    showMyPermssions () {
        for (object in NUMBER_OF_OBJECTS) {
            return;
        }
    }
};

for (let i = 0; i < NUMBER_OF_USERS; i++) {
    let permissions = [];
    let user = new User('', ...permissions)
    users.push(user);
};

do {
    // handle the further logic
} while(true);