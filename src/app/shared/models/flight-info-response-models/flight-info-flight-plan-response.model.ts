export interface IFlightInfoFlightPlanResponse {
    header: {
      flight: string[]; // Daha geniş bir modelleme için array tipi
      time: string;
      tel: string;
      prepared: string;
      captain: string;
      signature: string;
    };
    main: {
      plan_fuel: string;
      crz_fl_temp: string;
      avg_wc: string;
      to_cg_percent: string;
      toc_wc: string;
      crz_cg_percent: string;
      route_description: string[]; // Bu da bir array olduğu için aynı şekilde genişletildi
      ctot: string;
      msr: string;
      tropo: string;
      oat: string;
      ci: string;
      planFT: string;
      ver: string;
      pi: string;
      speed: string;
      reserveMinDiv: string;
    };
    side: {
      top: SideValueGroup[]; // Tekrar eden yapılar ayrı bir tipe taşındı
      center: SideValueGroup[];
      bottom: SideValueGroup[];
    };
  }
  
  // Tekrar eden yapılar için bir interface
  export interface SideValueGroup {
    value: string;
    color: string;
  }
  