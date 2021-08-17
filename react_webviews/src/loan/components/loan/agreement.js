import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { formatAmountInr } from "utils/validators";

const Agreement = (props) => {
    const parentState = props.parent.state || {};
    let terms = [
        '“<b>Availability Period</b>" shall mean the period within which the Borrower can request a Drawdown from the Facility and is as detailed in the Loan Details Sheet;',
        '“<b>Available Facility Amount</b>” means at any point of time the undrawn amount of the Facility, including any amount of the Facility which becomes available pursuant to any repayment or prepayment of all or part of any previous Drawdown.',
        '“<b>Borrower</b>” means the borrower as described in the Loan Details Sheet;',
        '“<b>Borrower’s Dues</b>” means all sums payable by the Borrower to DMI, including outstanding Facility, interest, all other charges, costs and expenses;',
        '“<b>Drawdown</b>” shall mean each drawdown of the Facility within the Availability Period and as per the terms of the Financing Documents, including drawdown of any amount which becomes available against the Facility, pursuant to prepayment/ repayment of any earlier Drawdown;',
        '“<b>Due Date</b>” in respect of any payment means the date on which any amount is due from the Borrower to DMI;',
        '“<b>EMI</b>” means the equated monthly amount to be paid by the Borrower towards repayment of all outstanding Drawdowns and payment of interest (if applicable) as per Financing Documents;',
        '“<b>Facility</b>” means the maximum drawdown limit granted by DMI to the Borrower as per Loan Details Sheet, which may be available to the Borrower as a revolving credit;',
        '“<b>Financing Documents</b>” means these GC, the Loan Application, the Loan Details Sheet, including the annexures hereto and any documents executed by the Borrower or as required by DMI, as amended from time to time;',
        '“<b>Loan Application</b>” means the application in the prescribed form as submitted from time to time by the Borrower to DMI for seeking financing;',
        '“<b>Loan Details Sheet</b>” means the Loan Details Sheet executed between DMI and Borrower, from time to time;',
        '“<b>Material Adverse Effect</b>” means any event which in DMI’s opinion would have an adverse effect on (i) Borrower’s ability to pay the Borrower’s Dues or (ii) recoverability of the Borrower’s Dues;',
        '“<b>Overdue Interest Rate</b>” means the default interest as prescribed in the Loan Details Sheet which is payable on all amounts which are not paid on their respective Due Dates;',
        '“<b>Purpose</b>” means the utilization of each Drawdown as mentioned in the Loan Details Sheet.'
    ];
    
    let disbursement = [
        'The Borrower may at any time during the Availability Period, request disbursement of any amount to the extent of the Available Facility Amount. DMI shall have the sole and absolute discretion to allow or reject Drawdown against such request. The Facility may be in the nature of a revolving credit and the Available Facility Amount may change during the Availability Period on account of prepayments/repayment. Notwithstanding anything contained in this GC, DMI shall have the absolute right to cancel or refuse any further Drawdowns from the Facility at its sole discretion as it may deem fit, including on account of any change in credit evaluation of the Borrower.',
        'The Borrower shall pay non-refundable processing charges as stated in the Loan Details Sheet, along with tax thereof, which may be added as a deemed disbursement to the first Drawdown and the Borrower will accordingly be liable for entire Drawdown.'
    ];

    let interest_and_repayment = [
        'The Borrower will pay Interest (if applicable) on each Drawdown made by the Borrower of the Facility and all other amounts due as provided in Loan Details Sheet and the interest shall be compounded on a monthly basis. The Borrower will be liable for the entire Drawdown amount and shall pay the full amount for each Drawdown. However, in such cases, in the event the installment is not paid on the Due Date, all overdue amounts shall accrue Interest at the prescribed rate (“<b>Overdue Interest Rate”</b>) which shall be computed from the respective due dates for payments and the interest shall be compounded on a monthly basis.',
        'The tenure of each Drawdown shall be as provided in the Loan Details Sheet. EMI shall be as calculated by DMI as required for amortization of Drawdowns within their respective tenure and Interest payable thereon and not exceeding the maximum EMI as provided in the Loan Details Sheet. EMI shall only be towards principal outstanding and Interest thereon and does not include any default interest or any other charges payable by the Borrower pursuant to Financing Documents.',
        'The payment of each EMI on time is the essence of the contract. The Borrower acknowledges that s/he has understood the method of computation of EMI and shall not dispute the same.',
        'Notwithstanding anything stated elsewhere in the Financing Documents, all Borrower’s Dues, including EMI, shall be payable by the Borrower to DMI as and when demanded by DMI, at its sole discretion and without requirement of any reason being assigned. The Borrower shall pay such amounts, without any delay or demur, within 15 (fifteen) days of such demand.',
        'DMI shall be entitled to revise the rate of interest, if so required under any applicable law and DMI may recompute the EMI /the number of EMI for repayment of outstanding Facility and interest. Any such change as intimated by DMI to Borrower will be final and binding on the Borrower. In case of such revision the Borrower shall be entitled to prepay, within 30 (thirty) days of such revision, the entire outstanding Facility along with accrued Interest (if applicable), without any prepayment penalty.',
        '<b>In case of delayed payments, without prejudice to all other rights of DMI, DMI shall be entitled to Overdue Interest Rate (as prescribed in Loan Details Sheet) from the Borrower for the period of delay</b>',
        'The Borrower may pre-pay any Drawdown prior to its scheduled tenure only with the prior approval of DMI and subject to such conditions and prepayment charges, as stipulated by DMI.',
        'The Borrower shall bear all interest, tax, duties, cess duties and other forms of taxes whether applicable now or in the future, payable under any law at any time in respect of any payments made to DMI under the Financing Documents. If these are incurred by DMI, these shall be recoverable from the Borrower and will carry interest at the rate of Overdue Interest Rate from the date of payment till reimbursement.',
        'Notwithstanding any terms and conditions to the contrary contained in the Financing Documents, the amounts repaid by the Borrower shall be appropriated firstly towards cost, charges, expenses and other monies; secondly towards Overdue Interest Rate, if any; thirdly towards Interest; and lastly towards repayment of principal amount of a Facility.',
        'Interest (if applicable), Overdue Interest Rate and all other charges shall accrue from day to day and shall be computed on the basis of 365 days a year and the actual number of days elapsed.',
        'If the due date for any payment is not a business day, the amount will be paid by Borrower on immediately succeeding business day.',
        'All sums payable by the Borrower to DMI shall be paid without any deductions whatsoever. Credit/ discharge for payment will be given only on realization of amounts due.'
    ];

    let mode_of_payment = [
        'The Borrower shall, as required by DMI from time to time, provide (i)  (“eMandate”) or (ii) National Automated Clearing House (Debit Clearing)/ any other electronic or other clearing mandate (collectively referred to as “NACH”) as notified by the Reserve Bank of India (“RBI”) against Borrower’s bank account for payment of dues. Such eMandate /NACH shall be drawn from such bank and from such location as agreed to by DMI. The Borrower shall honor all payments without fail on first presentation/ due dates. eMandate / NACH provided by the Borrower/(s) may be utilized by DMI for realization of any Borrower’s Dues. The Borrower hereby unconditionally and irrevocably authorizes DMI to take all actions required for such realization. The Borrower shall promptly (and in any event within seven (7) days) replace the eMandate and/or the NACH and/or other documents executed for payment of Borrower’s Dues as may be required by DMI from time to time, at its sole discretion.',
        'The Borrower shall, at all times maintain sufficient funds in his/her bank account/s for due payment of the Borrower’s Dues on respective Due Dates. Borrower shall not close the bank account/s from which the eMandate / NACH have been issued or cancel or issues instructions to the bank or to DMI to stop or delay payment under the eMandate / NACH and DMI is not bound to take notice of any such communication.',
        'The Borrower agrees and acknowledges that the eMandate / NACH have been issued voluntarily in discharge of the Borrower’s Dues and not by way of a security for any purpose whatsoever. The Borrower also acknowledges that dishonor of any eMandate / NACH is a criminal offence under the Negotiable Instruments Act, 1881/The Payment and Settlements Act, 2007. The Borrower shall be liable to pay dishonour charges for each eMandate / NACH dishonour (as prescribed in Loan Details Sheet).',
        'Any dispute or difference of any nature whatsoever shall not entitle the Borrower to withhold or delay payment of any EMIs or other sum and DMI shall be entitled to present the eMandate / NACH on the respective due dates.',
        'Notwithstanding the issuance of eMandate / NACH, the Borrower will be solely responsible to ensure timely payment of dues.'
    ];

    let borrower = [
        'observe and perform all its obligations under the Financing Documents.',
        'immediately deliver to DMI all documents, including bank account statements as may be required by DMI from time to time. The Borrower also authorizes DMI to communicate independently with (i) any bank where the Borrower maintains an account and to seek details and statement in respect of such account from the bank and (ii) with any employer of any Borrower as DMI may deem necessary, including for monitoring Borrower’s creditworthiness.',
        'immediately notify DMI of any litigations or legal proceedings against any Borrower.',
        'notify DMI of any Material Adverse Effect or Event of Default.',
        'notify DMI in writing of all changes in the location/ address of office /residence /place of business or any change/resignation/termination / closure of employment/ profession /business.',
        'Not leave India for employment or business or long term stay abroad without fully repaying the Facility then outstanding, together with interest and other dues and charges.',
        'provide security, if any, as specified in Financing Documents or as may be required by DMI in case of any change in credit worthiness of any Borrower (as determined by DMI).',
        'Ensure deposit of salary and / or business proceeds in the account from which MANDATEs/ECS have been issued to DMI.',
        'On or prior to the first Drawdown take a credit life insurance policy as required by DMI which shall include a cover for accidents, death, permanent disability and unemployment and such other terms as shall be acceptable to DMI.',
        'comply at all times with applicable laws, including, Prevention of Money Laundering Act, 2002.',
        'Utilise each Drawdown only for the Purpose.'
    ];

    let borrower_represents = [
        'All the information provided by Borrower in the Loan Application and any other document, whether or not relevant for the ascertaining the credit worthiness of the Borrower, is true and correct and not misleading in any manner.',
        'The Borrower is capable of and entitled under all applicable laws to execute and perform the Financing Documents and the transactions thereunder.',
        'The Borrower is above 18 years of age and this GC is a legal, valid and binding obligation on him/her, enforceable against him/her in accordance with its terms.',
        'The Borrower declares that he/she is not prohibited by any law from availing this Facility.',
        'No event has occurred which shall prejudicially affect the interest of DMI or affect the financial conditions of Borrower or affect his/her liability to perform all or any of their obligations under the Financing Documents.',
        'Borrower is not in default of payment of any taxes or government dues.',
        'The Borrower will do all acts, deeds and things, as required by DMI to give effect to the terms of this GC.',
        'Commencement of any bankruptcy or insolvency proceedings against the Borrower.'
    ];

    let events = [
        'The Borrower fails to make payment of any Borrower’s Dues on Due Date.',
        'Breach of any terms, covenants, representation, warranty, declaration or confirmation under the Financing Documents.',
        'Any fraud or misrepresentation or concealment of material information by Borrower which could have affected decision of DMI to grant any Facility.',
        'Death, lunacy or any other permanent disability of the Borrower.',
        'Borrower utilises the Drawdown for any purpose other than the Purpose.',
        'Occurrence of any events, conditions or circumstances (including any change in law) which in the sole and absolute opinion of DMI could have a Material Adverse Effect, including limitation of any proceedings or action for bankruptcy/liquidation/ insolvency of the Borrower or attachment / restraint of any of its assets.'
    ];

    let consequences = [
        'Upon occurrence of any of the Events of Default and at any time thereafter, DMI shall have the right, but not the obligation to declare all sums outstanding in respect of the Facility, whether due or not, immediately repayable and upon the Borrower failing to make the said payments within 15 (fifteen) days thereof, DMI may at its sole discretion exercise any other right or remedy which may be available to DMI under any applicable law, including seeking any injunctive relief or attachment against the Borrower or their assets.',
        'The Borrower shall also be liable for payment of all legal and other costs and expenses resulting from the foregoing defaults or the exercise of DMI remedies.'
    ];

    let disclosures = [
        'The Borrower acknowledges and authorizes DMI to disclose all information and data relating to Borrower, the Facility, Drawdowns, default if any, committed by Borrower to such third parties/ agencies as DMI may deem appropriate and necessary to disclose and/or as authorized by RBI, including the TransUnion CIBIL Limited (CIBIL). The Borrower also acknowledges and authorizes such information to be used, processed by DMI / third parties/ CIBIL / RBI as they may deem fit and in accordance with applicable laws.  Further in Event of Default, DMI and such agencies shall have an unqualified right to disclose or publish the name of the Borrower /or its directors/ partners/co-applicants, as applicable, as ‘defaulters’ in such manner and through such medium as DMI / CIBIL/ RBI/ other authorized agency in their absolute discretion may think fit, including in newspapers, magazines and social media.',
        'The Borrower shall not hold DMI responsible for sharing and/or disclosing the information now or in future and also for any consequences suffered by the Borrower and/or other by reason thereof. The provisions of this clause 8 shall survive termination of the GC and the repayment of the Borrower’s Dues.'
    ];

    let miscellaneous = [
        'The entries made in records of DMI shall be conclusive evidence of existence and of the amount Borrower’s Dues and any statement of dues furnished by DMI shall be accepted by and be binding on the Borrower.',
        'Borrower’s liability for repayment of the Borrower’s Dues shall, in case where more than one Borrower have jointly applied for any Facility, be joint and several.',
        'Borrower shall execute all documents and amendments and shall co-operate with DMI as required by DMI (i) to comply with any RBI guidelines / directives or (ii) for giving DMI full benefit of rights under the Financing Documents. Without prejudice to the aforesaid the Borrower hereby irrevocably consents that on its failure to do so, such changes shall be deemed to be incorporated in the Financing Documents and shall be binding on the Borrower.',
        'Notwithstanding any suspension or termination of any Facility, all right and remedies of DMI as per Financing Documents shall continue to survive until the receipt by DMI of the Borrower’s Dues in full.',
        'The Borrower acknowledges that the rate of interest, penal charges, service charges and other charges payable and or agreed to be paid by the Borrower under Financing Documents are reasonable and acceptable to him/ her.',
        'The Borrower expressly recognizes and accepts that DMI shall, without prejudice to its rights to perform such activities itself or through its office employees, be entitled and has full power and authority so to appoint one or more third parties (hereinafter referred to as “<b>Service Providers</b>”) as DMI may select and to delegate to such party all or any of its functions, rights and power under Financing Documents relating to the sourcing, identity and verification of information pertaining to the Borrower administration, monitoring of the Facility and to perform and execute all lawful acts, deeds, matters and things connected therewith and incidental thereto including sending notices, contacting Borrower, receiving Cash / Cheques/ Drafts / Mandates from the Borrower in favour of DMI.',
        'The Borrower acknowledges that the financing transaction hereunder gives rise to a relationship of debtor and creditor as between him / her and DMI and not in respect of any service rendered/to be rendered by DMI. Accordingly, the provisions of the Consumer Protection Act, 1986 shall not apply to the transaction hereunder.',
        'The Borrower hereby authorizes DMI to verify all information and documents including, income proof documents, residence documents, address proof documents, identity documents and other such documents containing personal and financial information as are submitted by them for obtaining any Facility and that they also consent to subsequent retention of the same by DMI.',
        'The Borrower acknowledges and authorizes DMI to procure Borrower’s PAN No./copy of Pan Card, other identity proof and Bank Account details, from time to time and to also generate / obtain CIBIL, Experian, Hunter reports and such other reports as and when DMI may deem fit. The Borrower also hereby gives consent and authorizes DMI to undertake its KYC verification by Aadhar e-KYC or otherwise and undertake all such actions as may be required on its behalf or otherwise to duly complete the process of such verification including by way of Aadhar e-KYC and share such information with any authority and store such information in a manner it deems fit.',
        'In the event of any disagreement or dispute between DMI and the Borrower regarding the materiality of any matter including of any event occurrence, circumstance, change, fact information, document, authorization, proceeding, act, omission, claims, breach, default or otherwise, the opinion of DMI as to the materiality of any of the foregoing shall be final and binding on the Borrower.',
        'The Borrower and DMI may mutually agree on grant of a fresh facility on the terms and conditions of the GC and by 	execution of such further letter/undertaking by the Borrower as may be required by DMI.'
    ];

    let law = [
        'All Facility and the Financing Documents shall be governed by and construed in accordance with the laws of India.',
        'All disputes, differences and / or claims arising out of these presents or as to the construction, meaning or effect hereof or as to the right and liabilities of the parties under the Financing Documents shall be settled by arbitration in accordance with the provision of the Arbitration and Conciliation Act, 1996 or any statutory amendments thereof or any statute enacted for replacement therefore and shall be referred to the sole Arbitration of a person to be appointed by DMI. The place of arbitration shall be Delhi and proceeding shall be under fast track procedure as laid down in Section 29(B) of the Act. The awards including interim awards of the arbitration shall be final and binding on all parties concerned. The arbitrator may pass the award without stating any reasons in such award.',
        'Further, the present clause shall survive the termination of Financing Documents. The Courts at Delhi, India shall have exclusive jurisdiction (subject to the arbitration proceedings which are to be also conducted in Delhi, India) over any or all disputes arising out of the Financing Documents.'
    ];

    let assignment = [
        'The Borrower shall not be entitled to jointly or severally transfer or assign all or any of their right or obligation or duties under the Financing Documents to any person directly or indirectly or create any third party interest in favour of any person without the prior written consent of DMI.',
        'DMI shall be entitled to sell, transfer, assign or securitise in any manner whatsoever (in whole or in part and including through grant of participation rights) all or any of its benefits, right, obligation, duties and / or liabilities under Financing Documents, without the prior written consent of, or intimation to the Borrower in such manner and such terms as DMI may decide. In the event of such transfer, assignment or securitization, the Borrower shall perform and be liable to perform their obligation under the Financing Documents to such assignee or transferor. In such event, the Borrower shall substitute the remaining MANDATEs/ECS in favour of the transferee/ assignee if called upon to do so by DMI.'
    ];

    const convertToRoman = (num) => {
        var roman = {
          M: 1000,
          CM: 900,
          D: 500,
          CD: 400,
          C: 100,
          XC: 90,
          L: 50,
          XL: 40,
          X: 10,
          IX: 9,
          V: 5,
          IV: 4,
          I: 1
        };
        var str = '';
      
        for (var i of Object.keys(roman)) {
          var q = Math.floor(num / roman[i]);
          num -= q * roman[i];
          str += i.repeat(q);
        }
      
        return `(${str})`;
      }

    const renderAgreement = (props, index) => {
        return (
            <div key={index} id={'agreement_' + index} className="agree-tiles">
                <div className="agree-tiles-left">{index}</div>
                <div className="agree-tiles-right">{ReactHtmlParser(props)}</div>
            </div>
        )
    }

    const renderTerms = (props, index) => {
        return (
            <p key={props}>{ReactHtmlParser(props)}</p>
        )
    }

    return (
        <div className="loan-agreement" style={{fontSize:'13px', color:'#767e86'}}>
            <u>GENERAL TERMS AND CONDITIONS OF LOAN</u>
            <p>GENERAL TERMS AND CONDITIONS OF LOAN (“GC”) for loans by DMI Finance Private Limited having its registered office at Express Building, Third Floor, 9-10, Bahadur Shah Zafar Marg, New Delhi – 110002 (‘DMI’ which shall mean and include its successors and assigns)</p>

            <div className="agree-tiles">
                <div className="agree-tiles-left"><b>1.</b></div>
                <div className="agree-tiles-right"><b>DEFINITIONS</b></div>
            </div>

            <div className="agree-tiles">
                <div className="agree-tiles-left">1.1</div>
                <div className="agree-tiles-right">The terms and expressions contained in these GC and the Loan Application Form are defined as under:</div>
            </div>

            <div>
                {terms.map((term, index) => renderTerms(term))}
            </div>

            <div className="agree-tiles">
                <div className="agree-tiles-left">1.1A.</div>
                <div className="agree-tiles-right">In this GC, (a) the singular includes the plural (and vice versa) and (b) reference to a gender shall include references to the female, male and neutral genders.</div>
            </div>

            <div className="agree-tiles">
                <div className="agree-tiles-left"><b>1.</b></div>
                <div className="agree-tiles-right"><b>DISBURSEMENT</b></div>
            </div>

            <div>{disbursement.map((item, index) => renderAgreement(item, '1.'+(index+1)))}</div>

            <div className="agree-tiles">
                <div className="agree-tiles-left"><b>2.</b></div>
                <div className="agree-tiles-right"><b>INTEREST AND REPAYMENT</b></div>
            </div>

            <div>{interest_and_repayment.map((item, index) => renderAgreement(item, '2.'+(index+1)))}</div>

            <div className="agree-tiles">
                <div className="agree-tiles-left"><b>3.</b></div>
                <div className="agree-tiles-right"><b>MODE OF PAYMENT, REPAYMENT AND PREPAYMENT</b></div>
            </div>

            <div>{mode_of_payment.map((item, index) => renderAgreement(item, '3.'+(index+1)))}</div>

            <div className="agree-tiles">
                <div className="agree-tiles-left"><b>4.</b></div>
                <div className="agree-tiles-right"><b>BORROWER’S COVENANTS, REPRESENTATION AND WARRANTIES</b></div>
            </div>

            <div className="agree-tiles">
                <div className="agree-tiles-left">4.1</div>
                <div className="agree-tiles-right">The Borrower shall:</div>
            </div>

            <div>{borrower.map((item, index) => renderAgreement(item, convertToRoman(index+1)))}</div>

            <div className="agree-tiles">
                <div className="agree-tiles-left">4.2</div>
                <div className="agree-tiles-right">Each Borrower represents and warrants to DMI as under:</div>
            </div>

            <div>{borrower_represents.map((item, index) => renderAgreement(item, convertToRoman(index+1)))}</div>

            <div className="agree-tiles">
                <div className="agree-tiles-left">4.3</div>
                <p className="agree-tiles-right">The Borrower gives its consent to DMI to use/store all the information provided by the Borrower or otherwise procured by DMI in the manner it deems fit including for the purposes of this Facility or for its business and understands and agrees that DMI may disclose such information to its contractors, agents and any other third parties.</p>
            </div>

            <div className="agree-tiles">
                <div className="agree-tiles-left"><b>5.</b></div>
                <div className="agree-tiles-right"><b>EVENTS OF DEFAULT</b></div>
            </div>

            <div className="agree-tiles">
                <div className="agree-tiles-left">5.1</div>
                <div className="agree-tiles-right">The following acts/events, shall each constitute an “Event of Default” by the Borrower for the purposes of each Facility:</div>
            </div>

            <div>{events.map((item, index) => renderAgreement(item, convertToRoman(index+1)))}</div>

            <div className="agree-tiles">
                <div className="agree-tiles-left">5.2</div>
                <div className="agree-tiles-right">The decision of DMI as to whether or not an Event of Default has occurred shall be binding upon the Borrower.</div>
            </div>

            <div className="agree-tiles">
                <div className="agree-tiles-left"><b>6.</b></div>
                <div className="agree-tiles-right"><b>CONSEQUENCES OF DEFAULT</b></div>
            </div>

            <div>{consequences.map((item, index) => renderAgreement(item, '6.'+(index+1)))}</div>

            <div className="agree-tiles">
                <div className="agree-tiles-left"><b>7.</b></div>
                <div className="agree-tiles-right"><b>DISCLOSURES</b></div>
            </div>

            <div>{disclosures.map((item, index) => renderAgreement(item, '7.'+(index+1)))}</div>

            <div className="agree-tiles">
                <div className="agree-tiles-left"><b>8.</b></div>
                <div className="agree-tiles-right"><b>MISCELLANEOUS</b></div>
            </div>

            <div>{miscellaneous.map((item, index) => renderAgreement(item, '8.'+(index+1)))}</div>

            <div className="agree-tiles">
                <div className="agree-tiles-left"><b>9.</b></div>
                <div className="agree-tiles-right"><b>SEVERABILITY</b></div>
            </div>

            <div className="agree-tiles">
                <div className="agree-tiles-right-2">The Borrower acknowledges that each of his /her obligations under these Financing Documents is independent and severable from the rest.</div>
            </div>

            <div className="agree-tiles">
                <div className="agree-tiles-left"><b>10.</b></div>
                <div className="agree-tiles-right"><b>GOVERNING LAW AND JURISDICTION</b></div>
            </div>

            <div>{law.map((item, index) => renderAgreement(item, '10.'+(index+1)))}</div>

            <div className="agree-tiles">
                <div className="agree-tiles-left"><b>11.</b></div>
                <div className="agree-tiles-right"><b>NOTICES</b></div>
            </div>

            <div className="agree-tiles">
                <div className="agree-tiles-right-2">Any notice to be given to the Borrower in respect of Financing Documents shall be deemed to have been validly given if served on the Borrower or sent by registered post to or left at the address of the Borrower existing or last known business or private address. Any such notice sent by registered post shall be deemed to have been received by the Borrower within 48 hours from the time of its posting. Any notice to DMI shall be deemed to have been valid only if received by DMI at its abovestated address.</div>
            </div>

            <div className="agree-tiles">
                <div className="agree-tiles-left"><b>12.</b></div>
                <div className="agree-tiles-right"><b>ASSIGNMENT</b></div>
            </div>

            <div>{assignment.map((item, index) => renderAgreement(item, '12.'+(index+1)))}</div>

            <div className="agree-tiles">
                <div className="agree-tiles-left"><b>13.</b></div>
                <div className="agree-tiles-right"><b>INDEMNITY</b></div>
            </div>

            <div className="agree-tiles">
                <div className="agree-tiles-right-2">The Borrower hereby indemnifies, defends and holds DMI, its employees, representatives and consultants harmless from time to time and at all times against any liability, claim, loss, judgment, damage, cost or expense (including, without limitation, reasonable attorney’s fees and expenses) as a result of or arising out of any failure by the Borrower to observe or perform any of the terms and conditions and obligations contained in the Financing Documents or Event of Default or the exercise of any of the rights by DMI under the Financing Documents, including for any enforcement of security or recovery of Borrower’s Dues.</div>
            </div>

            <div className="agree-tiles">
                <div className="agree-tiles-left"><b>14.</b></div>
                <div className="agree-tiles-right"><b>Acceptance:</b></div>
            </div>

            <div className="agree-tiles">
                <div className="agree-tiles-right-2"><b>I / We am / are aware that DMI shall agree to become a party to this GC only after satisfying itself with regard to all conditions and details filled by me / us in the GC and other Financing Documents in consonance with DMI policy.  I / We agree that this GC shall be concluded and become legally binding on the date when the authorized officer of DMI signing this at Delhi or on the date of first disbursement, whichever is earlier.</b></div>
            </div>

            <div className="agree-tiles">
                <div className="agree-tiles-right-2">By clicking “I accept”, the Borrower electronically signs these GC and agrees to be legally bound by its terms. The Borrower’s acceptance of these GC shall constitute: (i) the Borrower’s agreement to irrevocably accept and to be unconditionally bound by all the terms and conditions set out in these GC; and (ii) the Borrower’s acknowledgement and confirmation that these GC (along with the Financing Documents) have been duly read and fully understood by the Borrower.</div>
            </div>

            <div style={{textAlign:'center'}}><b>Annexure</b></div>

            <div><b>Loan Summary</b></div>

            <table>
                <tbody>
                <tr>
                    <td>Gross loan amount</td>
                    <td>{formatAmountInr(parentState.vendor_info.approved_amount_final)}</td>
                </tr>
                <tr>
                    <td>Processing fee</td>
                    <td>{formatAmountInr(parentState.vendor_info.processing_fee_final)}</td>
                </tr>
                <tr>
                    <td>GST(18%)</td>
                    <td>{formatAmountInr(parentState.vendor_info.gst_final)}</td>
                </tr>
                <tr>
                    <td>Net loan amount</td>
                    <td>{parentState.vendor_info.is_insured ? formatAmountInr(parentState.vendor_info.net_amount_final - parentState.vendor_info.insurance_premium_final) : formatAmountInr(parentState.vendor_info.net_amount_final)}</td>
                </tr>
                </tbody>
            </table>

            <div><b>Loan Detail Sheet</b></div>

            <table>
                <tbody>
                <tr>
                    <td>Transaction ID:</td>
                    <td>{parentState.vendor_info.application_id} </td>
                </tr>
                <tr>
                    <td>Date:</td>
                    <td>{parentState.currentDate} </td>
                </tr>
                </tbody>
            </table>

            <table>
                <tbody>
                <tr>
                    <td style={{width:'5px'}}>01.</td>
                    <td>Sourcing Partner</td>
                    <td>Fisdom</td>
                </tr>
                <tr>
                    <td style={{width:'5px'}}>02.</td>
                    <td>Loan Reference No.</td>
                    <td>{parentState.vendor_info.opportunity_name}</td>
                </tr>
                <tr>
                    <td style={{width:'5px'}}>03.</td>
                    <td>Borrower Details</td>
                    <td>
                        Name: {parentState.personal_info.full_name} <br />
                        Father's name: {parentState.personal_info.father_name}<br />
                        Address: {parentState.current_address_data.address}, {parentState.current_address_data.pincode},
                    {parentState.current_address_data.city}, {parentState.current_address_data.state},
                     {parentState.current_address_data.country} <br />
                     Pan No. {parentState.personal_info.pan_no}
                    </td>
                </tr>
                <tr>
                    <td style={{width:'5px'}}>04.</td>
                    <td>Rate of Interest % P.A (Annualized)</td>
                    <td>{parentState.vendor_info.loan_rate}%</td>
                </tr>
                <tr>
                    <td style={{width:'5px'}}>05.</td>
                    <td>EMI</td>
                    <td>{formatAmountInr(parentState.vendor_info.approved_emi)}</td>
                </tr>
                <tr>
                    <td style={{width:'5px'}}>06.</td>
                    <td>Tenor (Months)</td>
                    <td>{parentState.vendor_info.tenor} months</td>
                </tr>
                <tr>
                    <td style={{width:'5px'}}>07.</td>
                    <td>First EMI due date</td>
                    <td>
                        &bull; Cases processed between 1st to 20th of the month – will have their first EMI on 5th of coming month. <br />
                        &bull; Cases processed between 21st till last day of month – will have first EMI on 5th of next to next month.
                    </td>
                </tr>
                <tr>
                    <td style={{width:'5px'}}>08.</td>
                    <td>Security</td>
                    <td>None</td>
                </tr>
                <tr>
                    <td style={{width:'5px'}}>09.</td>
                    <td>Processing Fees</td>
                    <td>{formatAmountInr(parentState.vendor_info.processing_fee_final)}</td>
                </tr>
                <tr>
                    <td style={{width:'5px'}}>10.</td>
                    <td>Overdue Interest Rate</td>
                    <td>2%PM on overdue amount </td>
                </tr>
                <tr>
                    <td style={{width:'5px'}}>11.</td>
                    <td>Prepayment Charges</td>
                    <td>
                    Prepayment not allowed for first 6 months. Prepayment charges of 3% flat on the o/s principal to be applied post this + GST
                    </td>
                </tr>
                <tr>
                    <td style={{width:'5px'}}>12.</td>
                    <td>Bounce Charges</td>
                    <td>Rs. 450/- per dishonor</td>
                </tr>
                
                </tbody>
            </table>

            <div><b>DISBURSEMENT DETAILS (ACCOUNT TO WHICH DISBURSEMENT IS TO BE MADE)</b></div>

            <table>
                <tbody>
                <tr>
                    <td>Amount</td>
                    <td>{formatAmountInr(parentState.vendor_info.approved_amount_final)}</td>
                </tr>
                
                <tr>
                    <td>Account Name</td>
                    <td>{parentState.bank_info.account_holder_name}</td>
                </tr>
                <tr>
                    <td>Account No.</td>
                    <td>{parentState.bank_info.account_number}</td>
                </tr>
                <tr>
                    <td>Name of Bank</td>
                    <td>{parentState.bank_info.bank_name}</td>
                </tr>
                <tr>
                    <td>Branch Name IFSC Code:</td>
                    <td>{parentState.bank_info.ifsc_code}</td>
                </tr>
                
                </tbody>
            </table>


            <div style={{textAlign:'center'}}><b>Notes</b></div>

            <p>Charges & deductions applicable to this loan are as mentioned in the application form and have been explained to me. I/we confirm the receipt of General Terms & Conditions governing this loan, which have been signed by me/us in acceptance and a copy of which has been provided to me/us and confirm that the Facility granted by DMI on above terms will also be governed by aforesaid General Terms and Conditions and my Loan Application.</p>            

        </div>
    )
}

export default Agreement;
