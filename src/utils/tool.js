
export function downloadTxtFile(res, name) {
    const blob = new Blob([res], { type: 'text/plain' });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //msSaveOrOpenBlob：提供保存和打开按钮
        const fileName = name;
        window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
        const fileName = name;
        const elink = document.createElement('a');
        elink.style.display = 'none';
        //elink.href = URL.revokeObjectURL(blob);
        elink.href = URL.createObjectURL(blob);
        elink.download = fileName;
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
    }
}

export function downloadExcelFile(res, name) {
    const blob = new Blob([res], { type: 'vnd.ms-excel' });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //msSaveOrOpenBlob：提供保存和打开按钮
        const fileName = name;
        window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
        const fileName = name;
        const elink = document.createElement('a');
        elink.style.display = 'none';
        //elink.href = URL.revokeObjectURL(blob);
        elink.href = URL.createObjectURL(blob);
        elink.download = fileName;
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
    }
}

export function filter(val, unit = '') {
    if(!val) return '--'
    return val + unit
}
