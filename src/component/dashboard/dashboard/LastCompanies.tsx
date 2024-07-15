import React from 'react';
import { LastCompaniesProps } from '../../../types/types';

function LastCompanies({companies}: LastCompaniesProps) {
    return (
        <div>
            <h3>Last companies</h3>
            <hr />
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>TVA</th>
                        <th>Country</th>
                    </tr>
                </thead>
                <tbody>
                    {companies.slice(0,4).map((companies) => (
                        <tr key={companies.tva}>
                            <td>{companies.name}</td>
                            <td>{companies.tva}</td>
                            <td>{companies.country}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LastCompanies;