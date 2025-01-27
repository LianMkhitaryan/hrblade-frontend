const countries = [
  {
    code: 'AF',
    name: 'Afghanistan',
    isEU: false
  },
  {
    code: 'AX',
    name: 'Åland Islands',
    isEU: false
  },
  {
    code: 'AL',
    name: 'Albania',
    isEU: false
  },
  {
    code: 'DZ',
    name: 'Algeria',
    isEU: false
  },
  {
    code: 'AS',
    name: 'American Samoa',
    isEU: false
  },
  {
    code: 'AD',
    name: 'Andorra',
    isEU: false
  },
  {
    code: 'AO',
    name: 'Angola',
    isEU: false
  },
  {
    code: 'AI',
    name: 'Anguilla',
    isEU: false
  },
  {
    code: 'AQ',
    name: 'Antarctica',
    isEU: false
  },
  {
    code: 'AG',
    name: 'Antigua and Barbuda',
    isEU: false
  },
  {
    code: 'AR',
    name: 'Argentina',
    isEU: false
  },
  {
    code: 'AM',
    name: 'Armenia',
    isEU: false
  },
  {
    code: 'AW',
    name: 'Aruba',
    isEU: false
  },
  {
    code: 'AU',
    name: 'Australia',
    isEU: false
  },
  {
    code: 'AT',
    name: 'Austria',
    isEU: true
  },
  {
    code: 'AZ',
    name: 'Azerbaijan',
    isEU: false
  },
  {
    code: 'BS',
    name: 'Bahamas',
    isEU: false
  },
  {
    code: 'BH',
    name: 'Bahrain',
    isEU: false
  },
  {
    code: 'BD',
    name: 'Bangladesh',
    isEU: false
  },
  {
    code: 'BB',
    name: 'Barbados',
    isEU: false
  },
  {
    code: 'BY',
    name: 'Belarus',
    isEU: false
  },
  {
    code: 'BE',
    name: 'Belgium',
    isEU: true
  },
  {
    code: 'BZ',
    name: 'Belize',
    isEU: false
  },
  {
    code: 'BJ',
    name: 'Benin',
    isEU: false
  },
  {
    code: 'BM',
    name: 'Bermuda',
    isEU: false
  },
  {
    code: 'BT',
    name: 'Bhutan',
    isEU: false
  },
  {
    code: 'BO',
    name: 'Bolivia (Plurinational State of)',
    isEU: false
  },
  {
    code: 'BQ',
    name: 'Bonaire, Sint Eustatius and Saba[a]',
    isEU: false
  },
  {
    code: 'BA',
    name: 'Bosnia and Herzegovina',
    isEU: false
  },
  {
    code: 'BW',
    name: 'Botswana',
    isEU: false
  },
  {
    code: 'BV',
    name: 'Bouvet Island',
    isEU: false
  },
  {
    code: 'BR',
    name: 'Brazil',
    isEU: false
  },
  {
    code: 'IO',
    name: 'British Indian Ocean Territory',
    isEU: false
  },
  {
    code: 'BN',
    name: 'Brunei Darussalam',
    isEU: false
  },
  {
    code: 'BG',
    name: 'Bulgaria',
    isEU: true
  },
  {
    code: 'BF',
    name: 'Burkina Faso',
    isEU: false
  },
  {
    code: 'BI',
    name: 'Burundi',
    isEU: false
  },
  {
    code: 'CV',
    name: 'Cabo Verde',
    isEU: false
  },
  {
    code: 'KH',
    name: 'Cambodia',
    isEU: false
  },
  {
    code: 'CM',
    name: 'Cameroon',
    isEU: false
  },
  {
    code: 'CA',
    name: 'Canada',
    isEU: false
  },
  {
    code: 'KY',
    name: 'Cayman Islands',
    isEU: false
  },
  {
    code: 'CF',
    name: 'Central African Republic',
    isEU: false
  },
  {
    code: 'TD',
    name: 'Chad',
    isEU: false
  },
  {
    code: 'CL',
    name: 'Chile',
    isEU: false
  },
  {
    code: 'CN',
    name: 'China',
    isEU: false
  },
  {
    code: 'CX',
    name: 'Christmas Island',
    isEU: false
  },
  {
    code: 'CC',
    name: 'Cocos (Keeling) Islands',
    isEU: false
  },
  {
    code: 'CO',
    name: 'Colombia',
    isEU: false
  },
  {
    code: 'KM',
    name: 'Comoros',
    isEU: false
  },
  {
    code: 'CG',
    name: 'Congo',
    isEU: false
  },
  {
    code: 'CD',
    name: 'Congo, Democratic Republic of the',
    isEU: false
  },
  {
    code: 'CK',
    name: 'Cook Islands',
    isEU: false
  },
  {
    code: 'CR',
    name: 'Costa Rica',
    isEU: false
  },
  {
    code: 'CI',
    name: "Côte d'Ivoire",
    isEU: false
  },
  {
    code: 'HR',
    name: 'Croatia',
    isEU: true
  },
  {
    code: 'CU',
    name: 'Cuba',
    isEU: false
  },
  {
    code: 'CW',
    name: 'Curaçao',
    isEU: false
  },
  {
    code: 'CY',
    name: 'Cyprus',
    isEU: true
  },
  {
    code: 'CZ',
    name: 'Czechia',
    isEU: true
  },
  {
    code: 'DK',
    name: 'Denmark',
    isEU: true
  },
  {
    code: 'DJ',
    name: 'Djibouti',
    isEU: false
  },
  {
    code: 'DM',
    name: 'Dominica',
    isEU: false
  },
  {
    code: 'DO',
    name: 'Dominican Republic',
    isEU: false
  },
  {
    code: 'EC',
    name: 'Ecuador',
    isEU: false
  },
  {
    code: 'EG',
    name: 'Egypt',
    isEU: false
  },
  {
    code: 'SV',
    name: 'El Salvador',
    isEU: false
  },
  {
    code: 'GQ',
    name: 'Equatorial Guinea',
    isEU: false
  },
  {
    code: 'ER',
    name: 'Eritrea',
    isEU: false
  },
  {
    code: 'EE',
    name: 'Estonia',
    isEU: true
  },
  {
    code: 'SZ',
    name: 'Eswatini',
    isEU: false
  },
  {
    code: 'ET',
    name: 'Ethiopia',
    isEU: false
  },
  {
    code: 'FK',
    name: 'Falkland Islands (Malvinas)',
    isEU: false
  },
  {
    code: 'FO',
    name: 'Faroe Islands',
    isEU: false
  },
  {
    code: 'FJ',
    name: 'Fiji',
    isEU: false
  },
  {
    code: 'FI',
    name: 'Finland',
    isEU: true
  },
  {
    code: 'FR',
    name: 'France',
    isEU: true
  },
  {
    code: 'GF',
    name: 'French Guiana',
    isEU: false
  },
  {
    code: 'PF',
    name: 'French Polynesia',
    isEU: false
  },
  {
    code: 'TF',
    name: 'French Southern Territories',
    isEU: false
  },
  {
    code: 'GA',
    name: 'Gabon',
    isEU: false
  },
  {
    code: 'GM',
    name: 'Gambia',
    isEU: false
  },
  {
    code: 'GE',
    name: 'Georgia',
    isEU: false
  },
  {
    code: 'DE',
    name: 'Germany',
    isEU: true
  },
  {
    code: 'GH',
    name: 'Ghana',
    isEU: false
  },
  {
    code: 'GI',
    name: 'Gibraltar',
    isEU: false
  },
  {
    code: 'GR',
    name: 'Greece',
    isEU: true
  },
  {
    code: 'GL',
    name: 'Greenland',
    isEU: false
  },
  {
    code: 'GD',
    name: 'Grenada',
    isEU: false
  },
  {
    code: 'GP',
    name: 'Guadeloupe',
    isEU: false
  },
  {
    code: 'GU',
    name: 'Guam',
    isEU: false
  },
  {
    code: 'GT',
    name: 'Guatemala',
    isEU: false
  },
  {
    code: 'GG',
    name: 'Guernsey',
    isEU: false
  },
  {
    code: 'GN',
    name: 'Guinea',
    isEU: false
  },
  {
    code: 'GW',
    name: 'Guinea-Bissau',
    isEU: false
  },
  {
    code: 'GY',
    name: 'Guyana',
    isEU: false
  },
  {
    code: 'HT',
    name: 'Haiti',
    isEU: false
  },
  {
    code: 'HM',
    name: 'Heard Island and McDonald Islands',
    isEU: false
  },
  {
    code: 'VA',
    name: 'Holy See',
    isEU: false
  },
  {
    code: 'HN',
    name: 'Honduras',
    isEU: false
  },
  {
    code: 'HK',
    name: 'Hong Kong',
    isEU: false
  },
  {
    code: 'HU',
    name: 'Hungary',
    isEU: true
  },
  {
    code: 'IS',
    name: 'Iceland',
    isEU: false
  },
  {
    code: 'IN',
    name: 'India',
    isEU: false
  },
  {
    code: 'ID',
    name: 'Indonesia',
    isEU: false
  },
  {
    code: 'IR',
    name: 'Iran (Islamic Republic of)',
    isEU: false
  },
  {
    code: 'IQ',
    name: 'Iraq',
    isEU: false
  },
  {
    code: 'IE',
    name: 'Ireland',
    isEU: true
  },
  {
    code: 'IM',
    name: 'Isle of Man',
    isEU: false
  },
  {
    code: 'IL',
    name: 'Israel',
    isEU: false
  },
  {
    code: 'IT',
    name: 'Italy',
    isEU: true
  },
  {
    code: 'JM',
    name: 'Jamaica',
    isEU: false
  },
  {
    code: 'JP',
    name: 'Japan',
    isEU: false
  },
  {
    code: 'JE',
    name: 'Jersey',
    isEU: false
  },
  {
    code: 'JO',
    name: 'Jordan',
    isEU: false
  },
  {
    code: 'KZ',
    name: 'Kazakhstan',
    isEU: false
  },
  {
    code: 'KE',
    name: 'Kenya',
    isEU: false
  },
  {
    code: 'KI',
    name: 'Kiribati',
    isEU: false
  },
  {
    code: 'KP',
    name: "Korea (Democratic People's Republic of)",
    isEU: false
  },
  {
    code: 'KR',
    name: 'Korea, Republic of',
    isEU: false
  },
  {
    code: 'KW',
    name: 'Kuwait',
    isEU: false
  },
  {
    code: 'KG',
    name: 'Kyrgyzstan',
    isEU: false
  },
  {
    code: 'LA',
    name: "Lao People's Democratic Republic",
    isEU: false
  },
  {
    code: 'LV',
    name: 'Latvia',
    isEU: true
  },
  {
    code: 'LB',
    name: 'Lebanon',
    isEU: false
  },
  {
    code: 'LS',
    name: 'Lesotho',
    isEU: false
  },
  {
    code: 'LR',
    name: 'Liberia',
    isEU: false
  },
  {
    code: 'LY',
    name: 'Libya',
    isEU: false
  },
  {
    code: 'LI',
    name: 'Liechtenstein',
    isEU: false
  },
  {
    code: 'LT',
    name: 'Lithuania',
    isEU: true
  },
  {
    code: 'LU',
    name: 'Luxembourg',
    isEU: true
  },
  {
    code: 'MO',
    name: 'Macao',
    isEU: false
  },
  {
    code: 'MG',
    name: 'Madagascar',
    isEU: false
  },
  {
    code: 'MW',
    name: 'Malawi',
    isEU: false
  },
  {
    code: 'MY',
    name: 'Malaysia',
    isEU: false
  },
  {
    code: 'MV',
    name: 'Maldives',
    isEU: false
  },
  {
    code: 'ML',
    name: 'Mali',
    isEU: false
  },
  {
    code: 'MT',
    name: 'Malta',
    isEU: true
  },
  {
    code: 'MH',
    name: 'Marshall Islands',
    isEU: false
  },
  {
    code: 'MQ',
    name: 'Martinique',
    isEU: false
  },
  {
    code: 'MR',
    name: 'Mauritania',
    isEU: false
  },
  {
    code: 'MU',
    name: 'Mauritius',
    isEU: false
  },
  {
    code: 'YT',
    name: 'Mayotte',
    isEU: false
  },
  {
    code: 'MX',
    name: 'Mexico',
    isEU: false
  },
  {
    code: 'FM',
    name: 'Micronesia (Federated States of)',
    isEU: false
  },
  {
    code: 'MD',
    name: 'Moldova, Republic of',
    isEU: false
  },
  {
    code: 'MC',
    name: 'Monaco',
    isEU: false
  },
  {
    code: 'MN',
    name: 'Mongolia',
    isEU: false
  },
  {
    code: 'ME',
    name: 'Montenegro',
    isEU: false
  },
  {
    code: 'MS',
    name: 'Montserrat',
    isEU: false
  },
  {
    code: 'MA',
    name: 'Morocco',
    isEU: false
  },
  {
    code: 'MZ',
    name: 'Mozambique',
    isEU: false
  },
  {
    code: 'MM',
    name: 'Myanmar',
    isEU: false
  },
  {
    code: 'NA',
    name: 'Namibia',
    isEU: false
  },
  {
    code: 'NR',
    name: 'Nauru',
    isEU: false
  },
  {
    code: 'NP',
    name: 'Nepal',
    isEU: false
  },
  {
    code: 'NL',
    name: 'Netherlands',
    isEU: true
  },
  {
    code: 'NC',
    name: 'New Caledonia',
    isEU: false
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    isEU: false
  },
  {
    code: 'NI',
    name: 'Nicaragua',
    isEU: false
  },
  {
    code: 'NE',
    name: 'Niger',
    isEU: false
  },
  {
    code: 'NG',
    name: 'Nigeria',
    isEU: false
  },
  {
    code: 'NU',
    name: 'Niue',
    isEU: false
  },
  {
    code: 'NF',
    name: 'Norfolk Island',
    isEU: false
  },
  {
    code: 'MK',
    name: 'North Macedonia',
    isEU: false
  },
  {
    code: 'MP',
    name: 'Northern Mariana Islands',
    isEU: false
  },
  {
    code: 'NO',
    name: 'Norway',
    isEU: false
  },
  {
    code: 'OM',
    name: 'Oman',
    isEU: false
  },
  {
    code: 'PK',
    name: 'Pakistan',
    isEU: false
  },
  {
    code: 'PW',
    name: 'Palau',
    isEU: false
  },
  {
    code: 'PS',
    name: 'Palestine, State of',
    isEU: false
  },
  {
    code: 'PA',
    name: 'Panama',
    isEU: false
  },
  {
    code: 'PG',
    name: 'Papua New Guinea',
    isEU: false
  },
  {
    code: 'PY',
    name: 'Paraguay',
    isEU: false
  },
  {
    code: 'PE',
    name: 'Peru',
    isEU: false
  },
  {
    code: 'PH',
    name: 'Philippines',
    isEU: false
  },
  {
    code: 'PN',
    name: 'Pitcairn',
    isEU: false
  },
  {
    code: 'PL',
    name: 'Poland',
    isEU: true
  },
  {
    code: 'PT',
    name: 'Portugal',
    isEU: true
  },
  {
    code: 'PR',
    name: 'Puerto Rico',
    isEU: false
  },
  {
    code: 'QA',
    name: 'Qatar',
    isEU: false
  },
  {
    code: 'RE',
    name: 'Réunion',
    isEU: false
  },
  {
    code: 'RO',
    name: 'Romania',
    isEU: true
  },
  {
    code: 'RU',
    name: 'Russian Federation',
    isEU: false
  },
  {
    code: 'RW',
    name: 'Rwanda',
    isEU: false
  },
  {
    code: 'BL',
    name: 'Saint Barthélemy',
    isEU: false
  },
  {
    code: 'SH',
    name: 'Saint Helena, Ascension and Tristan da Cunha[b]',
    isEU: false
  },
  {
    code: 'KN',
    name: 'Saint Kitts and Nevis',
    isEU: false
  },
  {
    code: 'LC',
    name: 'Saint Lucia',
    isEU: false
  },
  {
    code: 'MF',
    name: 'Saint Martin (French part)',
    isEU: false
  },
  {
    code: 'PM',
    name: 'Saint Pierre and Miquelon',
    isEU: false
  },
  {
    code: 'VC',
    name: 'Saint Vincent and the Grenadines',
    isEU: false
  },
  {
    code: 'WS',
    name: 'Samoa',
    isEU: false
  },
  {
    code: 'SM',
    name: 'San Marino',
    isEU: false
  },
  {
    code: 'ST',
    name: 'Sao Tome and Principe',
    isEU: false
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    isEU: false
  },
  {
    code: 'SN',
    name: 'Senegal',
    isEU: false
  },
  {
    code: 'RS',
    name: 'Serbia',
    isEU: false
  },
  {
    code: 'SC',
    name: 'Seychelles',
    isEU: false
  },
  {
    code: 'SL',
    name: 'Sierra Leone',
    isEU: false
  },
  {
    code: 'SG',
    name: 'Singapore',
    isEU: false
  },
  {
    code: 'SX',
    name: 'Sint Maarten (Dutch part)',
    isEU: false
  },
  {
    code: 'SK',
    name: 'Slovakia',
    isEU: true
  },
  {
    code: 'SI',
    name: 'Slovenia',
    isEU: true
  },
  {
    code: 'SB',
    name: 'Solomon Islands',
    isEU: false
  },
  {
    code: 'SO',
    name: 'Somalia',
    isEU: false
  },
  {
    code: 'ZA',
    name: 'South Africa',
    isEU: false
  },
  {
    code: 'GS',
    name: 'South Georgia and the South Sandwich Islands',
    isEU: false
  },
  {
    code: 'SS',
    name: 'South Sudan',
    isEU: false
  },
  {
    code: 'ES',
    name: 'Spain',
    isEU: true
  },
  {
    code: 'LK',
    name: 'Sri Lanka',
    isEU: false
  },
  {
    code: 'SD',
    name: 'Sudan',
    isEU: false
  },
  {
    code: 'SR',
    name: 'Suriname',
    isEU: false
  },
  {
    code: 'SJ',
    name: 'Svalbard and Jan Mayen[c]',
    isEU: false
  },
  {
    code: 'SE',
    name: 'Sweden',
    isEU: true
  },
  {
    code: 'CH',
    name: 'Switzerland',
    isEU: false
  },
  {
    code: 'SY',
    name: 'Syrian Arab Republic',
    isEU: false
  },
  {
    code: 'TW',
    name: 'Taiwan, Province of China',
    isEU: false
  },
  {
    code: 'TJ',
    name: 'Tajikistan',
    isEU: false
  },
  {
    code: 'TZ',
    name: 'Tanzania, United Republic of',
    isEU: false
  },
  {
    code: 'TH',
    name: 'Thailand',
    isEU: false
  },
  {
    code: 'TL',
    name: 'Timor-Leste',
    isEU: false
  },
  {
    code: 'TG',
    name: 'Togo',
    isEU: false
  },
  {
    code: 'TK',
    name: 'Tokelau',
    isEU: false
  },
  {
    code: 'TO',
    name: 'Tonga',
    isEU: false
  },
  {
    code: 'TT',
    name: 'Trinidad and Tobago',
    isEU: false
  },
  {
    code: 'TN',
    name: 'Tunisia',
    isEU: false
  },
  {
    code: 'TR',
    name: 'Turkey',
    isEU: false
  },
  {
    code: 'TM',
    name: 'Turkmenistan',
    isEU: false
  },
  {
    code: 'TC',
    name: 'Turks and Caicos Islands',
    isEU: false
  },
  {
    code: 'TV',
    name: 'Tuvalu',
    isEU: false
  },
  {
    code: 'UG',
    name: 'Uganda',
    isEU: false
  },
  {
    code: 'UA',
    name: 'Ukraine',
    isEU: false
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    isEU: false
  },
  {
    code: 'GB',
    name: 'United Kingdom of Great Britain and Northern Ireland',
    isEU: true
  },
  {
    code: 'US',
    name: 'United States of America',
    isEU: false
  },
  {
    code: 'UM',
    name: 'United States Minor Outlying Islands[e]',
    isEU: false
  },
  {
    code: 'UY',
    name: 'Uruguay',
    isEU: false
  },
  {
    code: 'UZ',
    name: 'Uzbekistan',
    isEU: false
  },
  {
    code: 'VU',
    name: 'Vanuatu',
    isEU: false
  },
  {
    code: 'VE',
    name: 'Venezuela (Bolivarian Republic of)',
    isEU: false
  },
  {
    code: 'VN',
    name: 'Viet Nam',
    isEU: false
  },
  {
    code: 'VG',
    name: 'Virgin Islands (British)',
    isEU: false
  },
  {
    code: 'VI',
    name: 'Virgin Islands (U.S.)',
    isEU: false
  },
  {
    code: 'WF',
    name: 'Wallis and Futuna',
    isEU: false
  },
  {
    code: 'EH',
    name: 'Western Sahara',
    isEU: false
  },
  {
    code: 'YE',
    name: 'Yemen',
    isEU: false
  },
  {
    code: 'ZM',
    name: 'Zambia',
    isEU: false
  },
  {
    code: 'ZW',
    name: 'Zimbabwe',
    isEU: false
  }
];

export default countries;
