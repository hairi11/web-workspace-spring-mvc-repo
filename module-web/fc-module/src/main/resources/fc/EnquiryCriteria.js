const EnquiryCriteria = {
    values() {
        return {
            dateFrom: document.querySelector('#dateFrom')?.value || '',
            dateTo: document.querySelector('#dateTo')?.value || '',
            fcCode: document.querySelector('#fcCodeSelect')?.value || '',
            fxCode: document.querySelector('#fxCodeSelect')?.value || ''
        };
    }
};

export default EnquiryCriteria;
