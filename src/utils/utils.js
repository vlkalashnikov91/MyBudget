export const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export const SummMask = (string) => {
    return string.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
}