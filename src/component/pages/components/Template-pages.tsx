import Footer from "./../../main/Footer";
import Header from "./Header";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import useAPI from "../../../hook/useAPI";
import { Contact, Contacts } from "../../../types/contactsType";
import { useState, useEffect } from "react";

function TemplatePages() {
  const location = useLocation();
  const navigate = useNavigate();
  const ariane = location.pathname;
  const newPath: string = ariane.replace("/", "");
  let placeHolder: string = "";

  const pathSegments = ariane.split("/");
  const nbrContactFromURL = parseInt(pathSegments[2], 10) || 10;
  const pageFromURL = parseInt(pathSegments[3], 10) || 1;

  const [nbrContact, setNbrContact] = useState(nbrContactFromURL);
  const [page, setPage] = useState(pageFromURL);
  const { contacts, loading, nbrPageContact } = useAPI(`http://localhost:3000/api/contacts/pagination/${nbrContact}/${page}`);
  const { invoices, nbrPageInvoice } = useAPI(`http://localhost:3000/api/invoices/pagination/${nbrContact}/${page}`);
  const { companies, nbrPageCompanies } = useAPI(`http://localhost:3000/api/companies/pagination/${nbrContact}/${page}`);

  const definePath = () => {
    if (newPath.includes("contacts")) {
      return "contacts";
    } else if (newPath.includes("companies")) {
      return "companies";
    } else if (newPath.includes("invoices")) {
      return "invoices";
    } else {
      throw new Error("Invalid URL format");
    }
  }

  useEffect(() => {
    navigate(`/${definePath()}/${nbrContact}/${page}`);
  }, [page, nbrContact, navigate]);

  if (loading) return <p>Loading...</p>;

  const definePlaceHolder = () => {
    const path = definePath();
    switch (path) {
      case "companies":
        placeHolder = "Search company";
        break;
      case "contacts":
        placeHolder = "Search contact";
        break;
      case "invoices":
        placeHolder = "Search invoice";
        break;
    }
  };

  definePlaceHolder();

  const defineTitre = () => {
    const path = definePath();
    switch (path) {
      case "companies":
        return "Companies";
      case "contacts":
        return "Contacts";
      case "invoices":
        return "Invoices";
    }
  };

  const tableData = (path: string): JSX.Element => {
    path = definePath();
    switch (path) {
      case "companies":
        return (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>TVA</th>
                <th>Country</th>
                <th>Type</th>
                <th>Created at</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company._id}>
                  <td>{company.name}</td>
                  <td>{company.vat}</td>
                  <td>{company.country}</td>
                  {/* <td>{company.type}</td> */}
                  <td>{company.createdAt}</td>
                </tr>
              ))}
              <tr>
                <td>Raviga</td>
                <td>US456 654 321</td>
                <td>United States</td>
                <td>Supplier</td>
                <td>25/09/2020</td>
              </tr>
            </tbody>
          </table>
        );
      case "contacts":
        return Array.isArray(contacts) ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Mail</th>
                <th>Company</th>
                <th>Created at</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact._id}>
                  <td>{contact.name}</td>
                  <td>{contact.phoneNr}</td>
                  <td>{contact.email}</td>
                  <td>{contact.companyId?.name}</td>
                  <td>{contact.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No contacts available</p>
        );
      case "invoices":
        return (
          <table>
            <thead>
              <tr>
                <th>Invoice number</th>
                <th>Dates due</th>
                <th>Company</th>
                <th>Created at</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>{invoice.reference}</td>
                  {/* <td>{invoice.dueDate}</td> */}
                  <td>{invoice.companyId?.name}</td>
                  <td>{invoice.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return <h2>Oops, an error has occurred</h2>;
    }
  };

  const handleNextPage = (event: any) => {
    if (page < nbrPageContact) {
      event.preventDefault();
      const nextPage = page + 1;
      setPage(nextPage);
    }
  }

  const handlePreviousPage = (event :any ) => {
    event.preventDefault();
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
    }
  }

  return (
    <>
      <Header />
      <main>
        <h2 className="main__title"> All {defineTitre()}</h2>
        <section className="searchBar-section">
          <input
            type="search"
            name={newPath}
            id={newPath}
            placeholder={placeHolder}
          />
        </section>
        <section className="main-content">{tableData(newPath)}</section>
        <section className="pagination">
          <button onClick={handlePreviousPage} className="btnPagination"><FontAwesomeIcon icon={faChevronLeft} /></button>
          <span className={`btnPagination ${page === 1 ? "hide" : ""}`}>{page === 1 ? "" : page-1}</span>
          <span className="btnPagination pageActive">{page}</span>
          <span className={`btnPagination ${page === nbrPageContact ? "hide" : ""}`}>{page>nbrPageContact-1 ? "" : page+1}</span>
          <button onClick={handleNextPage} className="btnPagination"><FontAwesomeIcon icon={faChevronRight} /></button>
        </section>
      </main>
      <Footer />      
    </>
  );
}

export default TemplatePages;
