window.CaseMaster = (() => {
    const toKebabCase = s => s.split(" ").map(e => e.toLowerCase()).join("-");
    const toLowerCase = s => s.split(" ").map(e => e.toLowerCase()).join("");
    const toUpperCase = s => s.split(" ").map(e => `${e[0].toUpperCase()}${e.slice(1).toLowerCase()}`).join("");
    const toCamelCase = s => {
        const upperCase = toUpperCase(s);
        return `${upperCase[0].toLowerCase()}${upperCase.slice(1)}`
    };
    const toSnakeCase = s => s.split(" ").map(e => e.toLowerCase()).join("_");
    const dotsToSlashes = s => s.split(".").join("/");

    return (original) => ({
        original,
        lowerCase: toLowerCase(original),
        upperCase: toUpperCase(original),
        kebabCase: toKebabCase(original),
        camelCase: toCamelCase(original),
        snakeCase: toSnakeCase(original),
        dotsToSlashes: dotsToSlashes(original),
    })
})();