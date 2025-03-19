import { RhetosConfig } from '@ngx-floyd/rhetos';
import { Translation } from 'primeng/api';

export const environment = {
  production: true,
  rhetosConfig: {
    url: 'https://localhost:49265',
    withCredentials: true,
    delete404OK: false,
    suppressLoadMetadataOnAppInit: true,
    suppressLoadUserSpecificDataOnAppInit: true,
    useMsDate: false,
    useIsoWithCorrectionForTimezone: true,
  } as RhetosConfig,
  floydConfig: {
    floatingLabel: true,
    defaultUiActionTootipPosition: 'left',
    dateFormat: 'dd.mm.yy',
    convertEmptyStringToUndefined: true,
    date: {
      showIcon: true,
      showOnFocus: false,
      icon: 'fa-regular fa-calendar'
    },
    shortString: {
      maxLength: 256
    },
    autoComplete: {
      minSearchLength: 3,
      autoHighlight: true
    },
    multiselectDropdown: {
      maxSelectedLabels: 100
    },
    fileUpload: {
      invalidFileTypeMessageSummary: '{0}: Tip datoteke nije podržan, ',
      invalidFileTypeMessageDetail: 'podržani tipovi datoteka: {0}.'
    },
    tableOptions: {
      autoLayout: false,
      scrollable: true,
      resizableColumns: true,
      showRefreshButton: true
    },
    tablePaginator: {
      rowsPerPageOptions: [25, 50, 100],
      defaultRows: 50,
      showCurrentPageReport: true,
      currentPageReportTemplate: '{first} - {last} od {totalRecords} zapisa'
    },
    defaultButtonStyle: 'raised-text',
    defaultActionButtonStyle: 'text',
    showButtonLabel: true,
    defaultTableActionButtonStyle: 'text',
    defaultTableActionButtonType: 'primary',
    errorVisualizer: {
      userError: {
        severity: 'error',
        summary: 'Greška'
      },
      systemError: {
        severity: 'error',
        summary: 'Greška'
      },
      sticky: true
    },
    icons: {
      searchIcon: 'fas fa-search',
      filterIcon: 'fas fa-filter',
      plusIcon: 'fas fa-plus',
      trashIcon: 'far fa-trash-alt'
    }
  } as FloydUiConfig,
  primeNgTranslation: {
    choose: 'Odaberi',
    upload: 'Spremi',
    cancel: 'Odustani',
    emptyMessage: 'Nije pronađen niti jedan zapis',
    emptyFilterMessage: 'Nije pronađen niti jedan zapis',
    addRule: 'Dodaj pravilo',
    clear: 'Očisti',
    apply: 'Primjeni',
    removeRule: 'Obriši pravilo',
    startsWith: 'Počinje sa',
    contains: 'Sadrži',
    notContains: 'Ne sadrži',
    endsWith: 'Završava sa',
    equals: 'Jednako',
    notEquals: 'Različito od',
    monthNames: ['Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj', 'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'],
    monthNamesShort: ['Sij', 'Velj', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro'],
    dayNames: ['Nedjelja', 'Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota'],
    dayNamesShort: ['Ned', 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub'],
    dayNamesMin: ['Ned', 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub']
  } as Translation,
};
