import {inject} from 'aurelia-framework';

@inject(Element)
export class Hero {

    /**
     * @param {HTMLElement} element The Hero DOM element
     */
    constructor(element) {
        this.element = element;
    }

    attached() {
        document.body.addEventListener('mousemove', this.onMouseMove.bind(this));

        this.initialCutLeft = Math.max(this.cutImage.offsetLeft, 0);
        this.initialCutTop = Math.max(this.cutImage.offsetTop, 0);
        this.initialHeroLeft = Math.max(this.heroImage.offsetLeft, 0);
        this.initialHeroTop = Math.max(this.heroImage.offsetTop, 0);
    }

    onMouseMove(ev) {
        let x = ev.clientX - this.element.offsetLeft;
        let y = ev.clientY - this.element.offsetTop;

        this._parallax(this.cutImage, this.initialCutLeft, this.initialCutTop, x, y, 5);
        this._parallax(this.heroImage, this.initialHeroLeft, this.initialHeroTop, x, y, 15);

    }

    /**
     * Perform a Parallax transition
     * @param {HTMLElement} elem 
     * @param {Number} left 
     * @param {Number} top 
     * @param {Number} mouseX 
     * @param {Number} mouseY 
     * @param {Number} speed 
     */
    _parallax(elem, left, top, mouseX, mouseY, speed) {
        let parentElem = elem.parentNode;
        let containerWidth = parseInt(parentElem.offsetWidth);
        let containerHeight = parseInt(parentElem.offsetHeight);
        elem.style['background-position-x'] = left - ( ( ( mouseX - ( parseInt(elem.offsetWidth) / 2 + left ) )  / containerWidth) * speed ) + 'px';
        // elem.style['background-position-y'] = top - ( ( ( mouseY - ( parseInt(elem.offsetHeight) / 2 + top ) )  / containerHeight) * speed ) + 'px';
    }

}