export const taxFilingSteps = [
  {
    title: 'Upload form 16',
    subtitle: 'Your income, deductions and TDS details will be auto-filled',
    icon: 'icn_upload_form_16',
  },
  {
    title: 'Review & edit',
    subtitle: 'You can check/edit details and verify the ITR summary',
    icon: 'icn_review_edit',
  },
  {
    title: 'File ITR',
    subtitle: 'You’ll get an acknowledgement from govt. on successful filing',
    icon: 'icn_file_itr',
  },
]

export const FAQs = [
  {
    title: 'How can I file an income tax return in India?',
    subtitle:
      "You can file your income tax returns online, either on the income tax department's website or with our tax filing platform tax2win.in.",
  },
  {
    title: 'What is Tax2win?',
    subtitle:
      'Tax2win is an e-filing platform authorized by the income tax department and a fully owned subsidiary of fisdom. ',
  },
  {
    title: 'Can I get assistance while filing my taxes?',
    subtitle:
      'Ofcourse! You can avail the services of an expert eCA to calculate your taxes and eFile on your behalf. Our team’s priority is to ensure you always receive the maximum savings. ',
  },
  {
    title: 'If I have paid excess tax, how can I get the refund?',
    subtitle:
      'You can claim tax refunds by filing your income tax return. Once ITR is filed, any excess tax will be refunded to your bank account as mentioned in the ITR.',
  },
  {
    title: 'Which income tax return (ITR) should I select for e-filing?',
    subtitle:
      'There are 7 different forms (ITR 1, 2, 3, 4, 5, 6 and 7) to suit different tax situations. Since, most might not be aware of which form to choose, our e-filing system automatically decides for you based on your details.',
  },
  {
    title:
      'My company deducts TDS. Do I still have to file my income tax return (ITR)?',
    subtitle:
      "Yes, deducting TDS and filing an ITR are two different things. ITR is filed to show that you've paid the tax required to pay in the given financial year.<br /><br /> Note: The ITR is also a very useful document when it comes to applying for a loan or visa.",
  },
  {
    title: "I don't have Form 16. How can I file my income tax return (ITR)?",
    subtitle:
      'You can still file your tax return without Form 16. You just have to enter your basic and income details.',
  },
]



export const itrStatusMappings = {
  filed: {
    color: '#4F2DA7',
    icon: 'icn_self_itr',
    text: 'COMPLETED',
    resumable: false,
  },
  open: { color: '#35CB5D', icon: 'icn_ca', text: 'STARTED' },
  created: { color: '#B39712', icon: 'icn_self_itr', text: 'IN PROGRESS' },
}
