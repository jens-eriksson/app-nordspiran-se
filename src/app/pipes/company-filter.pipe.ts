import { List } from './../../../shared/list';
import { Company } from './../../../shared/company';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'companyFilter',
    pure: false
})
export class CompanyFilterPipe implements PipeTransform {
    transform(items: Company[], list: List, sortBy?: string): any {
        if (!items) {
            return items;
        }
        let result = items;
        if(list) {
            result = [];
            items.forEach(c => {
                if (list.companies.includes(c.id)) {
                    result.push(c);
                }
            });
        }
        
        if (sortBy) {
            result = result.sort(this.compare(sortBy));
        }
        return result;
    }

    private compare(property) {
        let sortOrder = 1;
        if (property[0] === '-') {
            sortOrder = -1;
            property = property.substr(1);
        }
        return (a, b) => {
            const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        };
    }
}