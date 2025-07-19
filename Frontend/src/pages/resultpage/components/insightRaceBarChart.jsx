import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const dataJson=[

  {
    "date": "2005",
    "name": "IFF (.jpg)",
    "value": 0
  },
  {
    "date": "2005",
    "name": "IFF & IFA (.jpg)",
    "value": 3396
  },
  {
    "date": "2006",
    "name": "East India Retail Summit_(EIRS) (.jpg)",
    "value": 39
  },
  {
    "date": "2006",
    "name": "ICS (.jpg)",
    "value": 325
  },
  {
    "date": "2006",
    "name": "IFF & IFA (.jpg)",
    "value": 12776
  },
  {
    "date": "2006",
    "name": "The Shop (.jpg)",
    "value": 9053
  },
  {
    "date": "2007",
    "name": "ICS (.jpg)",
    "value": 81
  },
  {
    "date": "2007",
    "name": "IFF (.jpg)",
    "value": 6
  },
  {
    "date": "2007",
    "name": "IFF & IFA (.jpg)",
    "value": 4569
  },
  {
    "date": "2007",
    "name": "The Shop (.jpg)",
    "value": 2641
  },
  {
    "date": "2008",
    "name": "Food_Forum_India (.jpg)",
    "value": 3373
  },
  {
    "date": "2008",
    "name": "Food_Forum_India (.pdf)",
    "value": 2
  },
  {
    "date": "2008",
    "name": "IFF (.jpg)",
    "value": 22
  },
  {
    "date": "2008",
    "name": "IFF & IFA (.jpg)",
    "value": 18120
  },
  {
    "date": "2008",
    "name": "IFF & IFA (.pdf)",
    "value": 5
  },
  {
    "date": "2008",
    "name": "ISCF (.jpg)",
    "value": 1344
  },
  {
    "date": "2008",
    "name": "SCN (.jpg)",
    "value": 6
  },
  {
    "date": "2009",
    "name": "EIGMEF_Images Event (.jpg)",
    "value": 379
  },
  {
    "date": "2009",
    "name": "Food_Forum_India (.jpg)",
    "value": 5105
  },
  {
    "date": "2009",
    "name": "ICS (.jpg)",
    "value": 6
  },
  {
    "date": "2009",
    "name": "IFF (.jpg)",
    "value": 1958
  },
  {
    "date": "2009",
    "name": "IFF & IFA (.jpg)",
    "value": 6986
  },
  {
    "date": "2009",
    "name": "ISCF (.jpg)",
    "value": 3152
  },
  {
    "date": "2009",
    "name": "ISCF (.pdf)",
    "value": 0
  },
  {
    "date": "2009",
    "name": "SCN (.jpg)",
    "value": 0
  },
  {
    "date": "2010",
    "name": "Electronics Next India (.jpg)",
    "value": 615
  },
  {
    "date": "2010",
    "name": "Food_Forum_India (.jpg)",
    "value": 10028
  },
  {
    "date": "2010",
    "name": "ICS (.jpg)",
    "value": 87
  },
  {
    "date": "2010",
    "name": "IFF (.jpg)",
    "value": 1053
  },
  {
    "date": "2010",
    "name": "IFF (.pdf)",
    "value": 108
  },
  {
    "date": "2010",
    "name": "IFF & IFA (.avi)",
    "value": 88
  },
  {
    "date": "2010",
    "name": "IFF & IFA (.jpg)",
    "value": 18698
  },
  {
    "date": "2010",
    "name": "ISCF (.jpeg)",
    "value": 1
  },
  {
    "date": "2010",
    "name": "ISCF (.jpg)",
    "value": 9343
  },
  {
    "date": "2010",
    "name": "ISCF (.pdf)",
    "value": 0
  },
  {
    "date": "2010",
    "name": "ISCF (.png)",
    "value": 0
  },
  {
    "date": "2011",
    "name": "East India Retail Summit_(EIRS) (.jpg)",
    "value": 9287
  },
  {
    "date": "2011",
    "name": "Food_Forum_India (.jpg)",
    "value": 11699
  },
  {
    "date": "2011",
    "name": "ICS (.jpg)",
    "value": 184
  },
  {
    "date": "2011",
    "name": "IFF (.bmp)",
    "value": 0
  },
  {
    "date": "2011",
    "name": "IFF (.gif)",
    "value": 0
  },
  {
    "date": "2011",
    "name": "IFF (.jpg)",
    "value": 284
  },
  {
    "date": "2011",
    "name": "IFF (.mts)",
    "value": 216901
  },
  {
    "date": "2011",
    "name": "IFF (.pdf)",
    "value": 51
  },
  {
    "date": "2011",
    "name": "IFF & IFA (.jpg)",
    "value": 22038
  },
  {
    "date": "2011",
    "name": "ISCF (.jpeg)",
    "value": 0
  },
  {
    "date": "2011",
    "name": "ISCF (.jpg)",
    "value": 10760
  },
  {
    "date": "2011",
    "name": "ISCF (.pdf)",
    "value": 26
  },
  {
    "date": "2011",
    "name": "Shiprocket (.mp4)",
    "value": 133524
  },
  {
    "date": "2012",
    "name": "East India Retail Summit_(EIRS) (.jpg)",
    "value": 2315
  },
  {
    "date": "2012",
    "name": "Food_Forum_India (.jpg)",
    "value": 30292
  },
  {
    "date": "2012",
    "name": "Food_Forum_India (.pdf)",
    "value": 0
  },
  {
    "date": "2012",
    "name": "ICS (.jpg)",
    "value": 39
  },
  {
    "date": "2012",
    "name": "IFF (.bmp)",
    "value": 0
  },
  {
    "date": "2012",
    "name": "IFF (.gif)",
    "value": 0
  },
  {
    "date": "2012",
    "name": "IFF (.jpg)",
    "value": 1315
  },
  {
    "date": "2012",
    "name": "IFF (.mts)",
    "value": 66136
  },
  {
    "date": "2012",
    "name": "IFF (.pdf)",
    "value": 421
  },
  {
    "date": "2012",
    "name": "IFF (.png)",
    "value": 0
  },
  {
    "date": "2012",
    "name": "IFF & IFA (.jpg)",
    "value": 16282
  },
  {
    "date": "2012",
    "name": "ISCF (.jpg)",
    "value": 7120
  },
  {
    "date": "2012",
    "name": "ISCF (.pdf)",
    "value": 15
  },
  {
    "date": "2012",
    "name": "India Salon Wellness (.jpg)",
    "value": 8816
  },
  {
    "date": "2012",
    "name": "SCN (.jpg)",
    "value": 84
  },
  {
    "date": "2013",
    "name": "East India Retail Summit_(EIRS) (.jpg)",
    "value": 3790
  },
  {
    "date": "2013",
    "name": "Food_Forum_India (.jpg)",
    "value": 26
  },
  {
    "date": "2013",
    "name": "ICS (.jpg)",
    "value": 4
  },
  {
    "date": "2013",
    "name": "IFF (.gif)",
    "value": 0
  },
  {
    "date": "2013",
    "name": "IFF (.jpg)",
    "value": 116
  },
  {
    "date": "2013",
    "name": "IFF (.pdf)",
    "value": 49
  },
  {
    "date": "2013",
    "name": "IFF (.png)",
    "value": 0
  },
  {
    "date": "2013",
    "name": "IFF & IFA (.jpg)",
    "value": 38490
  },
  {
    "date": "2013",
    "name": "ISCF (.jpg)",
    "value": 7112
  },
  {
    "date": "2013",
    "name": "ISCF (.pdf)",
    "value": 4
  },
  {
    "date": "2013",
    "name": "India Golf Forum (.jpg)",
    "value": 645
  },
  {
    "date": "2013",
    "name": "India Salon Wellness (.jpg)",
    "value": 14195
  },
  {
    "date": "2013",
    "name": "PRC (.jpg)",
    "value": 30
  },
  {
    "date": "2013",
    "name": "SCN (.jpg)",
    "value": 685
  },
  {
    "date": "2013",
    "name": "SCN (.pdf)",
    "value": 0
  },
  {
    "date": "2014",
    "name": "CEO Meet (.jpg)",
    "value": 1243
  },
  {
    "date": "2014",
    "name": "East India Retail Summit_(EIRS) (.jpg)",
    "value": 560
  },
  {
    "date": "2014",
    "name": "East India Retail Summit_(EIRS) (.pdf)",
    "value": 2
  },
  {
    "date": "2014",
    "name": "Electronics Next India (.jpg)",
    "value": 99
  },
  {
    "date": "2014",
    "name": "Food_Forum_India (.jpg)",
    "value": 19616
  },
  {
    "date": "2014",
    "name": "Food_Forum_India (.pdf)",
    "value": 1
  },
  {
    "date": "2014",
    "name": "ICS (.jpg)",
    "value": 1549
  },
  {
    "date": "2014",
    "name": "IFF (.jpg)",
    "value": 278
  },
  {
    "date": "2014",
    "name": "IFF (.pdf)",
    "value": 15
  },
  {
    "date": "2014",
    "name": "IFF (.png)",
    "value": 0
  },
  {
    "date": "2014",
    "name": "IFF & IFA (.jpg)",
    "value": 54044
  },
  {
    "date": "2014",
    "name": "IFF & IFA (.pdf)",
    "value": 0
  },
  {
    "date": "2014",
    "name": "ISCF (.jpg)",
    "value": 19792
  },
  {
    "date": "2014",
    "name": "ISCF (.pdf)",
    "value": 6
  },
  {
    "date": "2014",
    "name": "India Golf Forum (.jpg)",
    "value": 2160
  },
  {
    "date": "2014",
    "name": "India Salon Wellness (.jpg)",
    "value": 142
  },
  {
    "date": "2014",
    "name": "PRC (.jpg)",
    "value": 1
  },
  {
    "date": "2014",
    "name": "SCN (.jpg)",
    "value": 101
  },
  {
    "date": "2014",
    "name": "SCN (.pdf)",
    "value": 1
  },
  {
    "date": "2015",
    "name": "Food_Forum_India (.jpg)",
    "value": 29980
  },
  {
    "date": "2015",
    "name": "Food_Forum_India (.mts)",
    "value": 31831
  },
  {
    "date": "2015",
    "name": "Food_Forum_India (.pdf)",
    "value": 1
  },
  {
    "date": "2015",
    "name": "ICS (.jpg)",
    "value": 2318
  },
  {
    "date": "2015",
    "name": "IFF (.bmp)",
    "value": 0
  },
  {
    "date": "2015",
    "name": "IFF (.gif)",
    "value": 0
  },
  {
    "date": "2015",
    "name": "IFF (.jpeg)",
    "value": 0
  },
  {
    "date": "2015",
    "name": "IFF (.jpg)",
    "value": 335
  },
  {
    "date": "2015",
    "name": "IFF (.pdf)",
    "value": 197
  },
  {
    "date": "2015",
    "name": "IFF (.png)",
    "value": 3
  },
  {
    "date": "2015",
    "name": "IFF & IFA (.gif)",
    "value": 0
  },
  {
    "date": "2015",
    "name": "IFF & IFA (.jpg)",
    "value": 33095
  },
  {
    "date": "2015",
    "name": "IFF & IFA (.mp4)",
    "value": 467
  },
  {
    "date": "2015",
    "name": "IFF & IFA (.pdf)",
    "value": 0
  },
  {
    "date": "2015",
    "name": "IFF & IFA (.wmv)",
    "value": 347
  },
  {
    "date": "2015",
    "name": "ISCF (.jpeg)",
    "value": 0
  },
  {
    "date": "2015",
    "name": "ISCF (.jpg)",
    "value": 14299
  },
  {
    "date": "2015",
    "name": "ISCF (.pdf)",
    "value": 76
  },
  {
    "date": "2015",
    "name": "ISCF (.png)",
    "value": 0
  },
  {
    "date": "2015",
    "name": "PRC (.jpg)",
    "value": 6
  },
  {
    "date": "2015",
    "name": "SCN (.jpg)",
    "value": 194
  },
  {
    "date": "2015",
    "name": "SCN (.png)",
    "value": 0
  },
  {
    "date": "2015",
    "name": "South India Retail Summit_(SIRS) (.jpg)",
    "value": 5736
  },
  {
    "date": "2016",
    "name": "D2C (.jpg)",
    "value": 0
  },
  {
    "date": "2016",
    "name": "D2C (.mts)",
    "value": 161446
  },
  {
    "date": "2016",
    "name": "East India Retail Summit_(EIRS) (.jpg)",
    "value": 6762
  },
  {
    "date": "2016",
    "name": "Food_Forum_India (.jpg)",
    "value": 36379
  },
  {
    "date": "2016",
    "name": "Food_Forum_India (.pdf)",
    "value": 0
  },
  {
    "date": "2016",
    "name": "IFF (.jpg)",
    "value": 80
  },
  {
    "date": "2016",
    "name": "IFF (.pdf)",
    "value": 0
  },
  {
    "date": "2016",
    "name": "IFF & IFA (.gif)",
    "value": 0
  },
  {
    "date": "2016",
    "name": "IFF & IFA (.jpeg)",
    "value": 0
  },
  {
    "date": "2016",
    "name": "IFF & IFA (.jpg)",
    "value": 36375
  },
  {
    "date": "2016",
    "name": "IFF & IFA (.mov)",
    "value": 1010
  },
  {
    "date": "2016",
    "name": "IFF & IFA (.mp4)",
    "value": 10
  },
  {
    "date": "2016",
    "name": "IFF & IFA (.pdf)",
    "value": 0
  },
  {
    "date": "2016",
    "name": "IFF & IFA (.png)",
    "value": 0
  },
  {
    "date": "2016",
    "name": "IRF & IRA (.jpg)",
    "value": 54890
  },
  {
    "date": "2016",
    "name": "IRF & IRA (.pdf)",
    "value": 6
  },
  {
    "date": "2016",
    "name": "ISCF (.jpg)",
    "value": 26900
  },
  {
    "date": "2016",
    "name": "ISCF (.pdf)",
    "value": 0
  },
  {
    "date": "2016",
    "name": "North India Retail Summit_(NIRS) (.jpg)",
    "value": 7194
  },
  {
    "date": "2016",
    "name": "Onebeat Roundtable (.mts)",
    "value": 8333
  },
  {
    "date": "2016",
    "name": "PRC (.jpg)",
    "value": 2
  },
  {
    "date": "2016",
    "name": "PRC (.mts)",
    "value": 297879
  },
  {
    "date": "2016",
    "name": "PRC (.pdf)",
    "value": 0
  },
  {
    "date": "2016",
    "name": "SCN (.jpg)",
    "value": 1354
  },
  {
    "date": "2016",
    "name": "SCN (.pdf)",
    "value": 390
  },
  {
    "date": "2016",
    "name": "South India Retail Summit_(SIRS) (.jpg)",
    "value": 4114
  },
  {
    "date": "2016",
    "name": "The Shop (.jpg)",
    "value": 72
  },
  {
    "date": "2017",
    "name": "D2C (.jpg)",
    "value": 4
  },
  {
    "date": "2017",
    "name": "D2C (.png)",
    "value": 0
  },
  {
    "date": "2017",
    "name": "Food_Forum_India (.jpg)",
    "value": 21724
  },
  {
    "date": "2017",
    "name": "Food_Forum_India (.mp4)",
    "value": 1909
  },
  {
    "date": "2017",
    "name": "Food_Forum_India (.pdf)",
    "value": 0
  },
  {
    "date": "2017",
    "name": "ICS (.jpg)",
    "value": 35
  },
  {
    "date": "2017",
    "name": "ICS (.pdf)",
    "value": 11
  },
  {
    "date": "2017",
    "name": "IFF (.jpg)",
    "value": 331
  },
  {
    "date": "2017",
    "name": "IFF (.pdf)",
    "value": 4
  },
  {
    "date": "2017",
    "name": "IFF (.png)",
    "value": 0
  },
  {
    "date": "2017",
    "name": "IFF & IFA (.jpg)",
    "value": 49146
  },
  {
    "date": "2017",
    "name": "IFF & IFA (.mov)",
    "value": 267
  },
  {
    "date": "2017",
    "name": "IFF & IFA (.mp4)",
    "value": 4031
  },
  {
    "date": "2017",
    "name": "IRF & IRA (.jpg)",
    "value": 1
  },
  {
    "date": "2017",
    "name": "ISCF (.jpeg)",
    "value": 0
  },
  {
    "date": "2017",
    "name": "ISCF (.jpg)",
    "value": 10293
  },
  {
    "date": "2017",
    "name": "ISCF (.pdf)",
    "value": 0
  },
  {
    "date": "2017",
    "name": "ISCF (.png)",
    "value": 0
  },
  {
    "date": "2017",
    "name": "North India Retail Summit_(NIRS) (.mp4)",
    "value": 354
  },
  {
    "date": "2017",
    "name": "PRC (.jpg)",
    "value": 1
  },
  {
    "date": "2017",
    "name": "PRC (.pdf)",
    "value": 0
  },
  {
    "date": "2017",
    "name": "SCN (.jpeg)",
    "value": 50
  },
  {
    "date": "2017",
    "name": "SCN (.jpg)",
    "value": 7396
  },
  {
    "date": "2017",
    "name": "SCN (.pdf)",
    "value": 3265
  },
  {
    "date": "2017",
    "name": "SCN (.png)",
    "value": 0
  },
  {
    "date": "2017",
    "name": "South India Retail Summit_(SIRS) (.jpg)",
    "value": 8824
  },
  {
    "date": "2018",
    "name": "D2C (.jpg)",
    "value": 18
  },
  {
    "date": "2018",
    "name": "D2C (.png)",
    "value": 0
  },
  {
    "date": "2018",
    "name": "Food_Forum_India (.jpg)",
    "value": 31894
  },
  {
    "date": "2018",
    "name": "Food_Forum_India (.mov)",
    "value": 392
  },
  {
    "date": "2018",
    "name": "Food_Forum_India (.mp4)",
    "value": 7700
  },
  {
    "date": "2018",
    "name": "Food_Forum_India (.mts)",
    "value": 113784
  },
  {
    "date": "2018",
    "name": "Food_Forum_India (.pdf)",
    "value": 27
  },
  {
    "date": "2018",
    "name": "ICS (.jpg)",
    "value": 1607
  },
  {
    "date": "2018",
    "name": "IFF (.jpeg)",
    "value": 0
  },
  {
    "date": "2018",
    "name": "IFF (.jpg)",
    "value": 618
  },
  {
    "date": "2018",
    "name": "IFF (.pdf)",
    "value": 279
  },
  {
    "date": "2018",
    "name": "IFF (.png)",
    "value": 0
  },
  {
    "date": "2018",
    "name": "IFF & IFA (.avi)",
    "value": 26
  },
  {
    "date": "2018",
    "name": "IFF & IFA (.jpg)",
    "value": 45845
  },
  {
    "date": "2018",
    "name": "IFF & IFA (.mov)",
    "value": 8339
  },
  {
    "date": "2018",
    "name": "IFF & IFA (.mp4)",
    "value": 14325
  },
  {
    "date": "2018",
    "name": "IFF & IFA (.pdf)",
    "value": 814
  },
  {
    "date": "2018",
    "name": "IFF & IFA (.png)",
    "value": 0
  },
  {
    "date": "2018",
    "name": "ISCF (.gif)",
    "value": 0
  },
  {
    "date": "2018",
    "name": "ISCF (.jpg)",
    "value": 14821
  },
  {
    "date": "2018",
    "name": "ISCF (.mov)",
    "value": 105
  },
  {
    "date": "2018",
    "name": "ISCF (.mp4)",
    "value": 328
  },
  {
    "date": "2018",
    "name": "ISCF (.pdf)",
    "value": 2
  },
  {
    "date": "2018",
    "name": "ISCF (.png)",
    "value": 0
  },
  {
    "date": "2018",
    "name": "North India Retail Summit_(NIRS) (.jpg)",
    "value": 2388
  },
  {
    "date": "2018",
    "name": "North India Retail Summit_(NIRS) (.mov)",
    "value": 132
  },
  {
    "date": "2018",
    "name": "North India Retail Summit_(NIRS) (.mp4)",
    "value": 201
  },
  {
    "date": "2018",
    "name": "North India Retail Summit_(NIRS) (.pdf)",
    "value": 10
  },
  {
    "date": "2018",
    "name": "PRC (.jpg)",
    "value": 24
  },
  {
    "date": "2018",
    "name": "PRC (.m4v)",
    "value": 162
  },
  {
    "date": "2018",
    "name": "PRC (.mts)",
    "value": 185507
  },
  {
    "date": "2018",
    "name": "PRC (.pdf)",
    "value": 3
  },
  {
    "date": "2018",
    "name": "SCN (.jpeg)",
    "value": 130
  },
  {
    "date": "2018",
    "name": "SCN (.jpg)",
    "value": 13671
  },
  {
    "date": "2018",
    "name": "SCN (.pdf)",
    "value": 5545
  },
  {
    "date": "2018",
    "name": "SCN (.png)",
    "value": 0
  },
  {
    "date": "2018",
    "name": "Shiprocket (.jpg)",
    "value": 9
  },
  {
    "date": "2018",
    "name": "South India Retail Summit_(SIRS) (.jpg)",
    "value": 6004
  },
  {
    "date": "2018",
    "name": "South India Retail Summit_(SIRS) (.mp4)",
    "value": 931
  },
  {
    "date": "2018",
    "name": "South India Retail Summit_(SIRS) (.pdf)",
    "value": 20
  },
  {
    "date": "2019",
    "name": "D2C (.jpg)",
    "value": 45
  },
  {
    "date": "2019",
    "name": "Food_Forum_India (.gif)",
    "value": 0
  },
  {
    "date": "2019",
    "name": "Food_Forum_India (.jpg)",
    "value": 34857
  },
  {
    "date": "2019",
    "name": "Food_Forum_India (.pdf)",
    "value": 273
  },
  {
    "date": "2019",
    "name": "Food_Forum_India (.png)",
    "value": 26
  },
  {
    "date": "2019",
    "name": "IFF (.jpeg)",
    "value": 0
  },
  {
    "date": "2019",
    "name": "IFF (.jpg)",
    "value": 3721
  },
  {
    "date": "2019",
    "name": "IFF (.pdf)",
    "value": 2629
  },
  {
    "date": "2019",
    "name": "IFF (.png)",
    "value": 20
  },
  {
    "date": "2019",
    "name": "IFF (.svg)",
    "value": 0
  },
  {
    "date": "2019",
    "name": "IFF & IFA (.jpg)",
    "value": 94760
  },
  {
    "date": "2019",
    "name": "IFF & IFA (.mov)",
    "value": 306
  },
  {
    "date": "2019",
    "name": "IFF & IFA (.mp4)",
    "value": 6547
  },
  {
    "date": "2019",
    "name": "IFF & IFA (.pdf)",
    "value": 194
  },
  {
    "date": "2019",
    "name": "ISCF (.gif)",
    "value": 0
  },
  {
    "date": "2019",
    "name": "ISCF (.jpeg)",
    "value": 20
  },
  {
    "date": "2019",
    "name": "ISCF (.jpg)",
    "value": 4267
  },
  {
    "date": "2019",
    "name": "ISCF (.mp4)",
    "value": 1688
  },
  {
    "date": "2019",
    "name": "ISCF (.pdf)",
    "value": 268
  },
  {
    "date": "2019",
    "name": "ISCF (.png)",
    "value": 5
  },
  {
    "date": "2019",
    "name": "PRC (.jpeg)",
    "value": 30
  },
  {
    "date": "2019",
    "name": "PRC (.jpg)",
    "value": 778
  },
  {
    "date": "2019",
    "name": "PRC (.pdf)",
    "value": 0
  },
  {
    "date": "2019",
    "name": "PRC (.png)",
    "value": 6
  },
  {
    "date": "2019",
    "name": "SCN (.jpeg)",
    "value": 292
  },
  {
    "date": "2019",
    "name": "SCN (.jpg)",
    "value": 27693
  },
  {
    "date": "2019",
    "name": "SCN (.mts)",
    "value": 142945
  },
  {
    "date": "2019",
    "name": "SCN (.pdf)",
    "value": 8193
  },
  {
    "date": "2019",
    "name": "SCN (.png)",
    "value": 0
  },
  {
    "date": "2020",
    "name": "D2C (.jpg)",
    "value": 1
  },
  {
    "date": "2020",
    "name": "Food_Forum_India (.jpg)",
    "value": 24063
  },
  {
    "date": "2020",
    "name": "Food_Forum_India (.pdf)",
    "value": 2
  },
  {
    "date": "2020",
    "name": "ICS (.jpg)",
    "value": 16
  },
  {
    "date": "2020",
    "name": "ICS (.pdf)",
    "value": 0
  },
  {
    "date": "2020",
    "name": "IFF (.jpg)",
    "value": 818
  },
  {
    "date": "2020",
    "name": "IFF (.pdf)",
    "value": 0
  },
  {
    "date": "2020",
    "name": "ISCF (.jpg)",
    "value": 1395
  },
  {
    "date": "2020",
    "name": "ISCF (.pdf)",
    "value": 0
  },
  {
    "date": "2020",
    "name": "PRC (.gif)",
    "value": 0
  },
  {
    "date": "2020",
    "name": "PRC (.jpeg)",
    "value": 1
  },
  {
    "date": "2020",
    "name": "PRC (.jpg)",
    "value": 725
  },
  {
    "date": "2020",
    "name": "PRC (.mp4)",
    "value": 210
  },
  {
    "date": "2020",
    "name": "PRC (.pdf)",
    "value": 0
  },
  {
    "date": "2020",
    "name": "PRC (.png)",
    "value": 5
  },
  {
    "date": "2020",
    "name": "SCN (.jpeg)",
    "value": 178
  },
  {
    "date": "2020",
    "name": "SCN (.jpg)",
    "value": 17989
  },
  {
    "date": "2020",
    "name": "SCN (.pdf)",
    "value": 4746
  },
  {
    "date": "2020",
    "name": "SCN (.png)",
    "value": 24
  },
  {
    "date": "2020",
    "name": "Shiprocket (.jpg)",
    "value": 0
  },
  {
    "date": "2021",
    "name": "D2C (.jpeg)",
    "value": 178
  },
  {
    "date": "2021",
    "name": "D2C (.jpg)",
    "value": 2777
  },
  {
    "date": "2021",
    "name": "D2C (.pdf)",
    "value": 545
  },
  {
    "date": "2021",
    "name": "D2C (.png)",
    "value": 6
  },
  {
    "date": "2021",
    "name": "ICS (.gif)",
    "value": 0
  },
  {
    "date": "2021",
    "name": "ICS (.jpg)",
    "value": 38
  },
  {
    "date": "2021",
    "name": "ICS (.mp4)",
    "value": 86592
  },
  {
    "date": "2021",
    "name": "ICS (.pdf)",
    "value": 8
  },
  {
    "date": "2021",
    "name": "ICS (.png)",
    "value": 0
  },
  {
    "date": "2021",
    "name": "IFF (.jpg)",
    "value": 68
  },
  {
    "date": "2021",
    "name": "ISCF (.jpeg)",
    "value": 0
  },
  {
    "date": "2021",
    "name": "ISCF (.jpg)",
    "value": 6847
  },
  {
    "date": "2021",
    "name": "ISCF (.mp4)",
    "value": 134
  },
  {
    "date": "2021",
    "name": "ISCF (.pdf)",
    "value": 669
  },
  {
    "date": "2021",
    "name": "ISCF (.png)",
    "value": 32
  },
  {
    "date": "2021",
    "name": "PRC (.jpeg)",
    "value": 6
  },
  {
    "date": "2021",
    "name": "PRC (.jpg)",
    "value": 44295
  },
  {
    "date": "2021",
    "name": "PRC (.m2ts)",
    "value": 1031
  },
  {
    "date": "2021",
    "name": "PRC (.m4v)",
    "value": 740
  },
  {
    "date": "2021",
    "name": "PRC (.mp4)",
    "value": 74761
  },
  {
    "date": "2021",
    "name": "PRC (.mts)",
    "value": 476636
  },
  {
    "date": "2021",
    "name": "PRC (.pdf)",
    "value": 1404
  },
  {
    "date": "2021",
    "name": "PRC (.png)",
    "value": 24
  },
  {
    "date": "2021",
    "name": "SCN (.jpeg)",
    "value": 155
  },
  {
    "date": "2021",
    "name": "SCN (.jpg)",
    "value": 13474
  },
  {
    "date": "2021",
    "name": "SCN (.mov)",
    "value": 497969
  },
  {
    "date": "2021",
    "name": "SCN (.mp4)",
    "value": 66893
  },
  {
    "date": "2021",
    "name": "SCN (.mts)",
    "value": 113076
  },
  {
    "date": "2021",
    "name": "SCN (.pdf)",
    "value": 2575
  },
  {
    "date": "2021",
    "name": "SCN (.png)",
    "value": 5
  },
  {
    "date": "2021",
    "name": "Shiprocket (.jpg)",
    "value": 201
  },
  {
    "date": "2021",
    "name": "Shiprocket (.mp4)",
    "value": 101897
  },
  {
    "date": "2022",
    "name": "D2C (.jpeg)",
    "value": 359
  },
  {
    "date": "2022",
    "name": "D2C (.jpg)",
    "value": 6715
  },
  {
    "date": "2022",
    "name": "D2C (.mp4)",
    "value": 351573
  },
  {
    "date": "2022",
    "name": "D2C (.mts)",
    "value": 880256
  },
  {
    "date": "2022",
    "name": "D2C (.pdf)",
    "value": 1110
  },
  {
    "date": "2022",
    "name": "D2C (.png)",
    "value": 12
  },
  {
    "date": "2022",
    "name": "D2C Photos (.jpg)",
    "value": 35616
  },
  {
    "date": "2022",
    "name": "Food_Forum_India (.jpg)",
    "value": 74156
  },
  {
    "date": "2022",
    "name": "Food_Forum_India (.mov)",
    "value": 1155685
  },
  {
    "date": "2022",
    "name": "Food_Forum_India (.mp4)",
    "value": 170628
  },
  {
    "date": "2022",
    "name": "Food_Forum_India (.mpeg)",
    "value": 26
  },
  {
    "date": "2022",
    "name": "Food_Forum_India (.mts)",
    "value": 21655
  },
  {
    "date": "2022",
    "name": "Food_Forum_India (.png)",
    "value": 0
  },
  {
    "date": "2022",
    "name": "ICS (.jpg)",
    "value": 86072
  },
  {
    "date": "2022",
    "name": "ICS (.mov)",
    "value": 450703
  },
  {
    "date": "2022",
    "name": "ICS (.pdf)",
    "value": 1
  },
  {
    "date": "2022",
    "name": "IFF (.jpeg)",
    "value": 0
  },
  {
    "date": "2022",
    "name": "IFF (.jpg)",
    "value": 619
  },
  {
    "date": "2022",
    "name": "IFF (.mov)",
    "value": 2057428
  },
  {
    "date": "2022",
    "name": "IFF (.mp4)",
    "value": 347
  },
  {
    "date": "2022",
    "name": "IFF (.pdf)",
    "value": 78
  },
  {
    "date": "2022",
    "name": "IFF (.png)",
    "value": 0
  },
  {
    "date": "2022",
    "name": "IFF & IFA (.jpg)",
    "value": 50273
  },
  {
    "date": "2022",
    "name": "IFF & IFA (.mp4)",
    "value": 347
  },
  {
    "date": "2022",
    "name": "ISCF (.jpeg)",
    "value": 0
  },
  {
    "date": "2022",
    "name": "ISCF (.jpg)",
    "value": 16475
  },
  {
    "date": "2022",
    "name": "ISCF (.pdf)",
    "value": 73
  },
  {
    "date": "2022",
    "name": "ISCF (.png)",
    "value": 11
  },
  {
    "date": "2022",
    "name": "ISCF (.svg)",
    "value": 0
  },
  {
    "date": "2022",
    "name": "Messagebird (.jpg)",
    "value": 5161
  },
  {
    "date": "2022",
    "name": "Messagebird (.mp4)",
    "value": 20640
  },
  {
    "date": "2022",
    "name": "Messagebird (.mts)",
    "value": 13263
  },
  {
    "date": "2022",
    "name": "PRC (.jpeg)",
    "value": 1
  },
  {
    "date": "2022",
    "name": "PRC (.jpg)",
    "value": 147419
  },
  {
    "date": "2022",
    "name": "PRC (.mov)",
    "value": 316
  },
  {
    "date": "2022",
    "name": "PRC (.mp4)",
    "value": 579262
  },
  {
    "date": "2022",
    "name": "PRC (.mts)",
    "value": 212979
  },
  {
    "date": "2022",
    "name": "PRC (.pdf)",
    "value": 0
  },
  {
    "date": "2022",
    "name": "PRC (.png)",
    "value": 0
  },
  {
    "date": "2022",
    "name": "SCN (.jpeg)",
    "value": 227
  },
  {
    "date": "2022",
    "name": "SCN (.jpg)",
    "value": 7417
  },
  {
    "date": "2022",
    "name": "SCN (.mts)",
    "value": 117919
  },
  {
    "date": "2022",
    "name": "SCN (.pdf)",
    "value": 1989
  },
  {
    "date": "2022",
    "name": "SCN (.png)",
    "value": 14
  },
  {
    "date": "2022",
    "name": "Shiprocket (.jpg)",
    "value": 41
  },
  {
    "date": "2022",
    "name": "Visenze (.mp4)",
    "value": 7875
  },
  {
    "date": "2022",
    "name": "Visenze (.mts)",
    "value": 22923
  },
  {
    "date": "2023",
    "name": "D2C (.jpeg)",
    "value": 231
  },
  {
    "date": "2023",
    "name": "D2C (.jpg)",
    "value": 13332
  },
  {
    "date": "2023",
    "name": "D2C (.mp4)",
    "value": 1272774
  },
  {
    "date": "2023",
    "name": "D2C (.mts)",
    "value": 301818
  },
  {
    "date": "2023",
    "name": "D2C (.pdf)",
    "value": 444
  },
  {
    "date": "2023",
    "name": "D2C (.png)",
    "value": 34
  },
  {
    "date": "2023",
    "name": "D2C Photos (.jpg)",
    "value": 29670
  },
  {
    "date": "2023",
    "name": "D2C Photos (.png)",
    "value": 5
  },
  {
    "date": "2023",
    "name": "Dubai-Event (.mov)",
    "value": 734590
  },
  {
    "date": "2023",
    "name": "Food_Forum_India (.jpg)",
    "value": 37189
  },
  {
    "date": "2023",
    "name": "Food_Forum_India (.mp4)",
    "value": 1204556
  },
  {
    "date": "2023",
    "name": "Food_Forum_India (.mts)",
    "value": 197482
  },
  {
    "date": "2023",
    "name": "Food_Forum_India (.pdf)",
    "value": 1
  },
  {
    "date": "2023",
    "name": "ICS (.jpg)",
    "value": 22253
  },
  {
    "date": "2023",
    "name": "ICS (.mov)",
    "value": 779395
  },
  {
    "date": "2023",
    "name": "ICS (.mp4)",
    "value": 261416
  },
  {
    "date": "2023",
    "name": "ICS (.pdf)",
    "value": 21
  },
  {
    "date": "2023",
    "name": "IFF (.jpeg)",
    "value": 0
  },
  {
    "date": "2023",
    "name": "IFF (.jpg)",
    "value": 111512
  },
  {
    "date": "2023",
    "name": "IFF (.m4v)",
    "value": 120
  },
  {
    "date": "2023",
    "name": "IFF (.mov)",
    "value": 121215
  },
  {
    "date": "2023",
    "name": "IFF (.mp4)",
    "value": 23746
  },
  {
    "date": "2023",
    "name": "IFF (.mts)",
    "value": 118217
  },
  {
    "date": "2023",
    "name": "IFF (.pdf)",
    "value": 5
  },
  {
    "date": "2023",
    "name": "IFF (.png)",
    "value": 44
  },
  {
    "date": "2023",
    "name": "IFF & IFA (.jpg)",
    "value": 110182
  },
  {
    "date": "2023",
    "name": "IFF & IFA (.mov)",
    "value": 158
  },
  {
    "date": "2023",
    "name": "IFF & IFA (.mp4)",
    "value": 434
  },
  {
    "date": "2023",
    "name": "IFF & IFA (.png)",
    "value": 39
  },
  {
    "date": "2023",
    "name": "ISCF (.jpg)",
    "value": 32198
  },
  {
    "date": "2023",
    "name": "Images Open (.jpg)",
    "value": 7787
  },
  {
    "date": "2023",
    "name": "Images Open (.mov)",
    "value": 49674
  },
  {
    "date": "2023",
    "name": "Images Open (.mp4)",
    "value": 11308
  },
  {
    "date": "2023",
    "name": "PRC (.jpeg)",
    "value": 29
  },
  {
    "date": "2023",
    "name": "PRC (.jpg)",
    "value": 247038
  },
  {
    "date": "2023",
    "name": "PRC (.m4v)",
    "value": 15
  },
  {
    "date": "2023",
    "name": "PRC (.mov)",
    "value": 71368
  },
  {
    "date": "2023",
    "name": "PRC (.mp4)",
    "value": 1498785
  },
  {
    "date": "2023",
    "name": "PRC (.mts)",
    "value": 760801
  },
  {
    "date": "2023",
    "name": "PRC (.pdf)",
    "value": 6
  },
  {
    "date": "2023",
    "name": "PRC (.png)",
    "value": 0
  },
  {
    "date": "2023",
    "name": "Pullman Better Commerce (.jpg)",
    "value": 2516
  },
  {
    "date": "2023",
    "name": "Pullman Better Commerce (.mts)",
    "value": 23889
  },
  {
    "date": "2023",
    "name": "SCN (.jpeg)",
    "value": 114
  },
  {
    "date": "2023",
    "name": "SCN (.jpg)",
    "value": 5394
  },
  {
    "date": "2023",
    "name": "SCN (.mov)",
    "value": 0
  },
  {
    "date": "2023",
    "name": "SCN (.mp4)",
    "value": 457765
  },
  {
    "date": "2023",
    "name": "SCN (.pdf)",
    "value": 1046
  },
  {
    "date": "2023",
    "name": "SCN (.png)",
    "value": 7
  },
  {
    "date": "2023",
    "name": "Ship rocket (.jpg)",
    "value": 19224
  },
  {
    "date": "2023",
    "name": "Shiprocket (.jpeg)",
    "value": 0
  },
  {
    "date": "2023",
    "name": "Shiprocket (.jpg)",
    "value": 15640
  },
  {
    "date": "2023",
    "name": "Shiprocket (.mp4)",
    "value": 287414
  },
  {
    "date": "2023",
    "name": "Shiprocket (.pdf)",
    "value": 100
  },
  {
    "date": "2023",
    "name": "Shiprocket (.png)",
    "value": 2
  },
  {
    "date": "2023",
    "name": "Visenze (.jpg)",
    "value": 6
  },
  {
    "date": "2024",
    "name": "Clikpost (.jpg)",
    "value": 937
  },
  {
    "date": "2024",
    "name": "Clikpost (.mts)",
    "value": 3518
  },
  {
    "date": "2024",
    "name": "D2C (.jpeg)",
    "value": 61
  },
  {
    "date": "2024",
    "name": "D2C (.jpg)",
    "value": 2747
  },
  {
    "date": "2024",
    "name": "D2C (.mp4)",
    "value": 217193
  },
  {
    "date": "2024",
    "name": "D2C (.mts)",
    "value": 339991
  },
  {
    "date": "2024",
    "name": "D2C (.pdf)",
    "value": 178
  },
  {
    "date": "2024",
    "name": "D2C (.png)",
    "value": 21
  },
  {
    "date": "2024",
    "name": "D2C Photos (.jpg)",
    "value": 23359
  },
  {
    "date": "2024",
    "name": "Dubai-Event (.jpg)",
    "value": 26
  },
  {
    "date": "2024",
    "name": "Dubai-Event (.mov)",
    "value": 274452
  },
  {
    "date": "2024",
    "name": "Dubai-Event (.mp4)",
    "value": 183044
  },
  {
    "date": "2024",
    "name": "Food_Forum_India (.jpg)",
    "value": 31993
  },
  {
    "date": "2024",
    "name": "Food_Forum_India (.mov)",
    "value": 208
  },
  {
    "date": "2024",
    "name": "Food_Forum_India (.mp4)",
    "value": 595406
  },
  {
    "date": "2024",
    "name": "Food_Forum_India (.mts)",
    "value": 300382
  },
  {
    "date": "2024",
    "name": "ICS (.jpg)",
    "value": 36681
  },
  {
    "date": "2024",
    "name": "ICS (.mov)",
    "value": 329333
  },
  {
    "date": "2024",
    "name": "ICS (.mp4)",
    "value": 512016
  },
  {
    "date": "2024",
    "name": "ICS (.png)",
    "value": 6
  },
  {
    "date": "2024",
    "name": "IFF (.jpg)",
    "value": 466
  },
  {
    "date": "2024",
    "name": "IFF (.mov)",
    "value": 3151
  },
  {
    "date": "2024",
    "name": "IFF (.mp4)",
    "value": 1345708
  },
  {
    "date": "2024",
    "name": "IFF (.pdf)",
    "value": 29
  },
  {
    "date": "2024",
    "name": "IFF (.png)",
    "value": 6
  },
  {
    "date": "2024",
    "name": "IFF & IFA (.jpg)",
    "value": 128163
  },
  {
    "date": "2024",
    "name": "IFF & IFA (.mov)",
    "value": 1378
  },
  {
    "date": "2024",
    "name": "IFF & IFA (.mp4)",
    "value": 10473
  },
  {
    "date": "2024",
    "name": "IFF & IFA (.pdf)",
    "value": 34
  },
  {
    "date": "2024",
    "name": "IFF & IFA (.png)",
    "value": 6
  },
  {
    "date": "2024",
    "name": "Images Open (.jpg)",
    "value": 4143
  },
  {
    "date": "2024",
    "name": "Images Open (.mov)",
    "value": 15413
  },
  {
    "date": "2024",
    "name": "Images Open (.mp4)",
    "value": 12751
  },
  {
    "date": "2024",
    "name": "PRC (.jpg)",
    "value": 203548
  },
  {
    "date": "2024",
    "name": "PRC (.mov)",
    "value": 942
  },
  {
    "date": "2024",
    "name": "PRC (.mp4)",
    "value": 2930714
  },
  {
    "date": "2024",
    "name": "PRC (.mts)",
    "value": 453459
  },
  {
    "date": "2024",
    "name": "PRC (.pdf)",
    "value": 6
  },
  {
    "date": "2024",
    "name": "PRC (.png)",
    "value": 1
  },
  {
    "date": "2024",
    "name": "PRC (.webm)",
    "value": 0
  },
  {
    "date": "2024",
    "name": "SCN (.jpeg)",
    "value": 182
  },
  {
    "date": "2024",
    "name": "SCN (.jpg)",
    "value": 3764
  },
  {
    "date": "2024",
    "name": "SCN (.pdf)",
    "value": 22
  },
  {
    "date": "2024",
    "name": "SCN (.png)",
    "value": 0
  },
  {
    "date": "2024",
    "name": "SCN X India D2C Summit -2024 (.jpeg)",
    "value": 50
  },
  {
    "date": "2024",
    "name": "SCN X India D2C Summit -2024 (.jpg)",
    "value": 25927
  },
  {
    "date": "2024",
    "name": "SCN X India D2C Summit -2024 (.mov)",
    "value": 1332660
  },
  {
    "date": "2024",
    "name": "Shiprocket (.jpg)",
    "value": 15
  },
  {
    "date": "2025",
    "name": "Clikpost (.mts)",
    "value": 2026
  },
  {
    "date": "2025",
    "name": "ICS (.jpg)",
    "value": 1255
  },
  {
    "date": "2025",
    "name": "IFF (.jpeg)",
    "value": 30
  },
  {
    "date": "2025",
    "name": "IFF (.jpg)",
    "value": 153669
  },
  {
    "date": "2025",
    "name": "IFF (.m4v)",
    "value": 22
  },
  {
    "date": "2025",
    "name": "IFF (.mov)",
    "value": 839
  },
  {
    "date": "2025",
    "name": "IFF (.mp4)",
    "value": 1351038
  },
  {
    "date": "2025",
    "name": "IFF (.pdf)",
    "value": 2901
  },
  {
    "date": "2025",
    "name": "IFF & IFA (.jpg)",
    "value": 202288
  },
  {
    "date": "2025",
    "name": "PRC (.jpg)",
    "value": 102783
  },
  {
    "date": "2025",
    "name": "PRC (.mov)",
    "value": 67209
  },
  {
    "date": "2025",
    "name": "PRC (.mp4)",
    "value": 1771316
  },
  {
    "date": "2025",
    "name": "PRC (.mts)",
    "value": 106964
  },
  {
    "date": "2025",
    "name": "PRC (.pdf)",
    "value": 12
  },
  {
    "date": "2025",
    "name": "Round tables (.jpg)",
    "value": 1938
  },
  {
    "date": "2025",
    "name": "SCN X India D2C Summit -2024 (.jpg)",
    "value": 5
  }
]

const BarRaceChart = ({ width = 400, height = 400, interval = 1500 }) => {
  const svgRef = useRef();
  const [step, setStep] = useState(0);
  const data = dataJson;

  const margin = { top: 40, right: 40, bottom: 40, left: 20 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const timeSteps = Array.from(new Set(data.map(d => d.date))).sort();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const chart = svg.selectAll("g.chart")
      .data([null])
      .join("g")
      .attr("class", "chart")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, chartWidth]);
    const y = d3.scaleBand().range([0, chartHeight]).padding(0.1);

    const nameSet = Array.from(new Set(data.map(d => d.name)));
    const color = d3.scaleOrdinal()
      .domain(nameSet)
      .range(nameSet.map((_, i) => d3.hsl((i * 137.508) % 360, 0.7, 0.55).toString()));

    const update = (currentData) => {
      const topN = 10;
      const sorted = currentData.sort((a, b) => b.value - a.value).slice(0, topN);

      x.domain([0, d3.max(sorted, d => d.value)]);
      y.domain(sorted.map(d => d.name));

      chart.selectAll(".bar")
        .data(sorted, d => d.name)
        .join(
          enter => enter.append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("y", d => y(d.name))
            .attr("height", y.bandwidth())
            .attr("fill", d => color(d.name))
            .attr("width", 0)
            .transition().duration(interval - 200)
            .attr("width", d => x(d.value)),

          update => update
            .transition().duration(interval - 200)
            .attr("y", d => y(d.name))
            .attr("width", d => x(d.value)),

          exit => exit.transition().duration(interval - 200)
            .attr("width", 0).remove()
        );

    //   chart.selectAll(".label")
    //     .data(sorted, d => d.name)
    //     .join(
    //       enter => enter.append("text")
    //         .attr("class", "label")
    //         .attr("y", d => y(d.name) + y.bandwidth() / 2)
    //         .attr("x", d => Math.max(x(d.value) - 5, 5)) // keep inside bar
    //         .attr("text-anchor", "end")
    //         .attr("alignment-baseline", "middle")
    //         .style("font-size", "12px")
    //         .style("fill", "white")
    //         .text(d => `${d.name} (${d.value})`),

    //       update => update
    //         .transition().duration(interval - 200)
    //         .attr("y", d => y(d.name) + y.bandwidth() / 2)
    //         .attr("x", d => Math.max(x(d.value) - 5, 5))
    //         .text(d => `${d.name} (${d.value})`),

    //       exit => exit.remove()
    //     );
    chart.selectAll(".label")
  .data(sorted, d => d.name)
  .join(
    enter => enter.append("text")
      .attr("class", "label")
      .attr("y", d => y(d.name) + y.bandwidth() / 2)
      .attr("x", 5)
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .style("font-size", "12px")
      .style("fill", "#555") // grayish color
      .text(d => `${d.name} (${d.value})`),

    update => update
      .transition().duration(interval - 200)
      .attr("y", d => y(d.name) + y.bandwidth() / 2)
      .attr("x", 5)
      .text(d => `${d.name} (${d.value})`),

    exit => exit.remove()
  );

    };

    update(data.filter(d => d.date === timeSteps[step]));

    // const timer = setInterval(() => {
    //   setStep(prev => {
    //     if (prev + 1 >= timeSteps.length) {
    //       clearInterval(timer);
    //       return prev;
    //     }
    //     return prev + 1;
    //   });
    // }, interval);
    const timer = setInterval(() => {
  setStep(prev => {
    if (prev + 1 >= timeSteps.length) {
      return 0; // Restart the race
    }
    return prev + 1;
  });
}, interval);


    return () => clearInterval(timer);
  }, [data, step]);

  return (
    <div style={{ textAlign: "left" }}>
      <svg ref={svgRef} style={{ display: "block" }} />
      <p style={{ fontWeight: "bold", marginLeft: 0 }}>{timeSteps[step]}</p>
    </div>
  );
};


export default BarRaceChart;
