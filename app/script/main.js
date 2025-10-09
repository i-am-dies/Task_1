let header = {
    getNodes() {
        let classTitles = ['header', 'header__logo-image'],
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
    },
    init() {
        let headerNodes = this.getNodes();

        onscroll = () => this.updateStickyness(headerNodes);

        this.updateStickyness(headerNodes);
    }
}

let phone = {
    getNodes() {
        return document.getElementsByClassName('input_tel');
    },
    format(string) {
        let result = '+7(';

        string = string.replace(/^.*\(|^\+7/, '')  // Clear prefix
                       .replace(/\D/g, '')         // Filter digits
                       .substring(0, 10);          // Remove trail

        for(let i = 0; i < string.length; i++) {
            if(i === 3) result += ')';
            if(i === 6) result += '-';
            if(i === 8) result += '-';

            result += string[i];
        }

        return result;
    },
    updateValue(event) {
        let node = event.target;

        if(event.type === 'input') {
            let formatted = this.format(node.value),
                p = node.selectionStart;

            node.value = formatted;

            if(p < 3)                              p = 3;                 // After prefix
            if(p > 3 && /\D/.test(formatted[p-1])) p++;                   // At digit and not at delimiter
            if(p > formatted.length)               p = formatted.length;  // Clamp to end

            node.setSelectionRange(p, p);
        } else
        if(event.type === 'paste') {
            event.preventDefault();

            let pasted = (event.clipboardData || window.clipboardData).getData('text'),
                formatted = this.format(pasted);

            node.value = formatted;
            node.setSelectionRange(node.value.length, node.value.length);
        }
    },
    updateFocus(event) {
        let node = event.target;

        if(event.type == 'focus' && node.value === '') {
            node.value = '+7(';
            node.setSelectionRange(3, 3);
        } else
        if(event.type == 'blur' && node.value === '+7(') {
            node.value = '';
        }
    },
    init() {
        let phoneNodes = this.getNodes();

        for(let node of phoneNodes) {
            node.onfocus = (e) => this.updateFocus(e);
            node.onblur  = (e) => this.updateFocus(e);
            node.oninput = (e) => this.updateValue(e);
            node.onpaste = (e) => this.updateValue(e);
        }
    }
}

let date = {
    getNodes(parentNode = document) {
        return parentNode.getElementsByClassName('input_date');
    },
    updateInvalid(nodes) {
        for(let node of nodes) {
            let methodTitle = node.value == '' ? 'add' : 'remove';

            node.classList[methodTitle]('input_date-invalid');
        }
    },
    setClamp(nodes) {  // Selector restrictions
        let minDate = new Date(),
            maxDate = new Date('9999-12-31T00:00:00');

        minDate.setHours(0, 0, 0, 0);

        let minDateString = minDate.toLocaleDateString('en-CA'),
            maxDateString = maxDate.toLocaleDateString('en-CA');

        for(let node of nodes) {
            node.min = minDateString;
            node.max = maxDateString;
        }
    },
    clamp(node) {  // Manual input restrictions
        let minDate = new Date(),
            maxDate = new Date('9999-12-31T00:00:00'),
            pickedDate = new Date(node.value);

        minDate.setHours(0, 0, 0, 0);

        if(isNaN(pickedDate)) {
            node.value = '';
        } else {
            pickedDate.setHours(0, 0, 0, 0);

            if(pickedDate < minDate) node.value = minDate.toLocaleDateString('en-CA');
            if(pickedDate > maxDate) node.value = maxDate.toLocaleDateString('en-CA');
        }
    },
    init() {
        let dateNodes = this.getNodes();

        for(let node of dateNodes) {
            node.onchange = () => this.updateInvalid([node]);
            node.onblur = () => this.clamp(node);
        }

        this.updateInvalid(dateNodes);
        this.setClamp(dateNodes);
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

var exampleAction = () => {
    alert('Пример действия по нажатию.');
}

onload = () => {
    header.init();
    phone.init();
    date.init();
}