
let header = {
    getNodes() {
        let classTitles = ['header', 'header__menu-holder', 'header__logo-image'],
            nodes = {}

        for(let classTitle of classTitles) {
            nodes[classTitle] = document.getElementsByClassName(classTitle);
        }

        return nodes;
    },
    updateStickyness(nodes) {
        let methodTitle = window.scrollY > 450 ? 'add' : 'remove';

        for(let classTitle in nodes) {
            for(let node of nodes[classTitle]) {
                node.classList[methodTitle](classTitle+'_fixed');
            }
        }
    }
}

let phone = {
    getNodes() {
        return document.getElementsByClassName('input_tel');
    },
    updateValue(nodes) {
        for(let node of nodes) {
            let oldValue = node.value,
                newValue = '';

            for(let i = 0; i < oldValue.length; i++) {
                let c = oldValue[i];

                /*
                JS RegExp does not support partial pattern match.
                It must be either hardcoded sequence of optional patterns, e.g.
                /\+|\+[78]|\+[78]\(.../ or just the plain JS mask, as shown below.
                */
                switch(i) {
                    case 0:  if(c == '+')             newValue += c; break;
                    case 1:  if(c == 7 || c == 8)     newValue += c; break;
                    case 2:  if(c == '(')             newValue += c; break;
                    case 3:
                    case 4:
                    case 5:  if(Number.isInteger(+c)) newValue += c; break;
                    case 6:  if(c == ')')             newValue += c; break;
                    case 7:
                    case 8:
                    case 9:  if(Number.isInteger(+c)) newValue += c; break;
                    case 10: if(c == '-')             newValue += c; break;
                    case 11:
                    case 12: if(Number.isInteger(+c)) newValue += c; break;
                    case 13: if(c == '-')             newValue += c; break;
                    case 14:
                    case 15: if(Number.isInteger(+c)) newValue += c; break;
                }
            }

            node.value = newValue;
        }
    }
}

let date = {
    getNodes(parentNode = document) {
        return parentNode.getElementsByClassName('input_date');
    },
    updateInvalid(nodes) {
        let todayDate = new Date();

        todayDate.setHours(0, 0, 0, 0);

        for(let node of nodes) {
            let pickedDate = new Date(node.value);

            if(node.value == '' || pickedDate < todayDate) {
                node.classList.add('input_date-invalid');
                node.value = '';
            } else {
                node.classList.remove('input_date-invalid');
            }
        }
    }
}

var form = {  // "var", so the object can be accessed from the "window"
    reset(node) {
        node.reset();

        let dateNodes = date.getNodes(node);

        for(let dateNode of dateNodes) {
            dateNode.classList.add('input_date-invalid');
        }
    }
}

onload = () => {
    let headerNodes = header.getNodes(),
        phoneNodes = phone.getNodes(),
        dateNodes = date.getNodes();

    onscroll = () => header.updateStickyness(headerNodes);
    for(let node of phoneNodes) node.oninput = () => phone.updateValue([node]);
    for(let node of dateNodes) node.onblur = () => date.updateInvalid([node]);

    header.updateStickyness(headerNodes);
    phone.updateValue(phoneNodes);
    date.updateInvalid(dateNodes);
}