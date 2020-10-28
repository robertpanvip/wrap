function getInlineStyle(cssText) {
    let style = {};
    if (cssText) {
        const cssTextArray = cssText.split(';').filter(item => item.trim() !== '');
        cssTextArray.forEach(item => {
            const itemStyleArr = item.split(':');
            style[itemStyleArr[0]] = itemStyleArr[1]
        })
    }
    return style;
}


window.CSSStyleDeclaration.prototype.setProperty = function (propertyName, value, priority) {
    const style = getInlineStyle(this.cssText)
    style[propertyName] = value;
    let cssText = '';
    for (const key in style) {
        const value = style[key];
        cssText += `${key}:${value}`
    }
    this.cssText = cssText;
};
window.CSSStyleDeclaration.prototype.removeProperty = function (propertyName) {
    const style = getInlineStyle(this.cssText)
    let cssText = '';
    delete style[propertyName];

    for (const key in style) {
        const value = style[key];
        cssText += `${key}:${value}`
    }
    this.cssText = cssText;
};