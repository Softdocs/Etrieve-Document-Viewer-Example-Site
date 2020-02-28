import { bindable, containerless, customElement, inject, inlineView, Loader } from 'aurelia-framework';

import environment from 'environment';

//TODO: Issue when using if binding where elements are not removed and duplicates are added. Workaround currently is wrapping svg container in element
//TODO: Cleanup needs to happen on element's leftover anchor tags

@containerless()
@inlineView('<template></template>')
@customElement('inline-svg')
@inject(Element, Loader)
export class InlineSvg {
    @bindable svg;

    constructor(el, loader) {
        this.el = el;
        this.loader = loader;
        this.classList;
        this.targetInstruction;
        this.view;
    }

    created(view) {
        this.view = view;
        this.targetInstruction = this.getTargetInstructionById(this.el.getAttribute('au-target-id')); //this.getTargetInstructionByType('class');
    }

    getTargetInstructionById(id) {
        return this.view.viewFactory.instructions[id];
    }

    getTargetInstructionByType(type) {
        let targetInst;
        for (let instKey in this.view.viewFactory.instructions) {
            let inst = this.view.viewFactory.instructions[instKey];
            if (inst.expressions && inst.expressions.length > 0) {
                let classExp = inst.expressions.some(exp => {
                    return exp.attribute === type;
                });
                if (classExp) {
                    targetInst = inst;
                }
            }
        }
        return targetInst;
    }

    bind(context) {
        this.classList = this.el.class;
        this.svgChanged(this.svg);
    }


    svgChanged(svg) {
        if (svg) {
            this.loader.loadText(`${svg}.html`)
                .then(text => {
                    try {
                        let nextSibling = getNextElementNode(this.el);

                        let containerDiv = document.createElement('div');
                        appendChildren(containerDiv, createSVG(text));

                        let svgElem = containerDiv.children[0];

                        let previousClassBindingIndex = this.view.bindings.findIndex(binding => {
                            return binding.target === nextSibling;
                        });

                        if (previousClassBindingIndex > -1) {
                            this.view.bindings.splice(previousClassBindingIndex, 1);
                        }

                        if (this.targetInstruction && this.targetInstruction.expressions.length > 0) {
                            for (let expression of this.targetInstruction.expressions) {
                                let svgBinding = expression.createBinding(svgElem);
                                this.view.addBinding(svgBinding);
                            }
                        }
                        //Loop through common classes to apply any missing attributes
                        //TODO: find a way to programatically add these
                        if (!svgElem.getAttribute('class') && this.el.getAttribute('class')) {
                            svgElem.setAttribute('class', this.el.getAttribute('class'));
                        }
                        if (!svgElem.getAttribute('click') && this.el.getAttribute('click')) {
                            svgElem.setAttribute('click', this.el.getAttribute('click'));
                        }
                        if (!svgElem.getAttribute('title') && this.el.getAttribute('title')) {
                            svgElem.setAttribute('title', this.el.getAttribute('title'));
                        }

                        let viewBox = this.el.getAttribute('viewBox');
                        if (viewBox) {
                            svgElem.setAttribute('viewBox', viewBox);
                        }

                        if (nextSibling && nextSibling.tagName.toLowerCase() === 'svg') {
                            let parentElement = nextSibling.parentElement || nextSibling.parentNode;
                            parentElement.replaceChild(svgElem, nextSibling);
                        } else {
                            let parentElement = this.el.parentElement || this.el.parentNode;
                            parentElement.insertBefore(svgElem, this.el.nextSibling);
                        }

                    } catch (err) {
                        console.error(err);
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }
}

function getNextElementNode(el) {
    let node = el.nextSibling;

    while (node && node.nodeType !== 1) {
        node = node.nextSibling;
    }

    return node;
}

/**
 * Take a string that represents a complete SVG and return the element created
 * @param {string} svgText
 * @returns {SVGElement}
 */
function createSVG(svgText) {
    let parser = new DOMParser();

    //Strip the template that was used for bundling
    svgText = svgText.replace(/^\<template\>/,'').replace(/\<\/template\>$/,'')
    let doc = parser.parseFromString(svgText, "text/html");
    let children = [];
    if (doc.body && doc.body.children) {
        children = doc.body.children;
    } else {
        console.error('Could not parse SVG');
    }
    return children;
}

/**
 * Append elements to an existing element
 * @param {Element} element Element that will have children appended onto
 * @param {Array} children
 */
function appendChildren(element, children) {
    for (let child of Array.from(children)) {
        element.appendChild(child);
    }
}
