<template>
  <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
    <defs>
      <!-- 静态图标定义 -->
      <symbol id="static-icon-home" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </symbol>
<symbol id="icon-park-outline--dot" viewBox="0 0 48 48"><path fill="currentColor" stroke="currentColor" stroke-width="4" d="M24 33a9 9 0 1 0 0-18a9 9 0 0 0 0 18Z"/></symbol>
      <symbol id="static-icon-settings" viewBox="0 0 35 34">
        <path
          d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
      </symbol>
      <symbol id="bx--file" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="M19.903 8.586a1 1 0 0 0-.196-.293l-6-6a1 1 0 0 0-.293-.196c-.03-.014-.062-.022-.094-.033a1 1 0 0 0-.259-.051C13.04 2.011 13.021 2 13 2H6c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9c0-.021-.011-.04-.013-.062a1 1 0 0 0-.051-.259q-.014-.048-.033-.093M16.586 8H14V5.414zM6 20V4h6v5a1 1 0 0 0 1 1h5l.002 10z" />
        <path fill="currentColor" d="M8 12h8v2H8zm0 4h8v2H8zm0-8h2v2H8z" />
      </symbol>
      <symbol id="line-md--computer-twotone" viewBox="0 0 36 34">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path stroke-dasharray="6" stroke-dashoffset="6" d="M12 21h5M12 21h-5">
            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="6;0" />
          </path>
          <path stroke-dasharray="6" stroke-dashoffset="6" d="M12 21v-4">
            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="6;0" />
          </path>
          <path fill="currentColor" fill-opacity="0" stroke-dasharray="64" stroke-dashoffset="64"
            d="M12 17h-9v-12h18v12Z">
            <animate fill="freeze" attributeName="fill-opacity" begin="1s" dur="0.15s" values="0;0.3" />
            <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.6s" values="64;0" />
          </path>
        </g>
      </symbol>

      <symbol id="material-symbols--logout" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z" />
      </symbol>

      <symbol id="arcticons--authenticator" viewBox="0 0 48 48">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
          d="M24 43.5c9.043-3.117 15.489-10.363 16.5-19.589c.28-4.005.257-8.025-.071-12.027a2.54 2.54 0 0 0-2.468-2.366c-4.091-.126-8.846-.808-12.52-4.427a2.05 2.05 0 0 0-2.881 0c-3.675 3.619-8.43 4.301-12.52 4.427a2.54 2.54 0 0 0-2.468 2.366A79.4 79.4 0 0 0 7.5 23.911C8.512 33.137 14.957 40.383 24 43.5"
          stroke-width="1" />
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
          d="M17.612 19.804h12.776c.484 0 .877.392.877.877v9.442a.877.877 0 0 1-.877.877H17.612a.877.877 0 0 1-.877-.877V20.68c0-.485.393-.878.877-.878"
          stroke-width="1" />
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
          d="M19.192 19.804V17.79a4.805 4.805 0 0 1 9.608 0v2.014" stroke-width="1" />
        <circle cx="23.996" cy="25.402" r="1.863" fill="none" stroke="currentColor" stroke-linecap="round"
          stroke-linejoin="round" stroke-width="1" />
      </symbol>
      <symbol id="solar--key-bold" viewBox="0 0 24 24">
        <path fill="currentColor" fill-rule="evenodd"
          d="M22 8.293c0 3.476-2.83 6.294-6.32 6.294c-.636 0-2.086-.146-2.791-.732l-.882.878c-.519.517-.379.669-.148.919c.096.105.208.226.295.399c0 0 .735 1.024 0 2.049c-.441.585-1.676 1.404-3.086 0l-.294.292s.881 1.025.147 2.05c-.441.585-1.617 1.17-2.646.146l-1.028 1.024c-.706.703-1.568.293-1.91 0l-.883-.878c-.823-.82-.343-1.708 0-2.05l7.642-7.61s-.735-1.17-.735-2.78c0-3.476 2.83-6.294 6.32-6.294S22 4.818 22 8.293m-6.319 2.196a2.2 2.2 0 0 0 2.204-2.195a2.2 2.2 0 0 0-2.204-2.196a2.2 2.2 0 0 0-2.204 2.196a2.2 2.2 0 0 0 2.204 2.195"
          clip-rule="evenodd" />
      </symbol>
      <symbol id="gravity-ui--logo-linux" viewBox="0 0 24 24">
        <path fill="currentColor" fill-rule="evenodd"
          d="M6.854 3.47a2.7 2.7 0 0 1 1.934.102l.618.275q.108.048.205.11q.004-.188.023-.377l.05-.495a1.441 1.441 0 1 0-2.868 0zm3.243 2.725a1.6 1.6 0 0 1-.423.433L7.95 7.835a1 1 0 0 1-1.468-.372l-.23-.46l-.99 2.226a3.04 3.04 0 0 0-.217 1.758c.46.333.81.817.968 1.393l.123.451c.52.419 1.181.669 1.901.669h.54q.053 0 .105-.002l.305-1.118a2.564 2.564 0 0 1 2.98-1.829q.033-.233.033-.473c0-.714-.223-1.41-.637-1.99l-.842-1.177a5 5 0 0 1-.424-.716m3.242 5.135a4.93 4.93 0 0 0-.756-4.114l-.841-1.177a3.4 3.4 0 0 1-.615-2.31l.05-.495a2.941 2.941 0 1 0-5.854 0l.08.8a3.67 3.67 0 0 1-.298 1.854L3.891 8.62a4.5 4.5 0 0 0-.39 1.88A2.54 2.54 0 0 0 1 13.027c0 1.16.79 2.17 1.914 2.452l1.92.48a1.396 1.396 0 0 0 1.727-1.204c.463.159.96.245 1.476.245h.451a1.396 1.396 0 0 0 1.679.958l1.919-.48A2.53 2.53 0 0 0 14 13.028c0-.653-.25-1.248-.66-1.697M8.18 4.943l.617.275c.03.013.04.025.044.032q.013.016.018.053a.1.1 0 0 1-.007.056c-.004.008-.01.022-.037.04l-1.25.875l-.549-1.097a.127.127 0 0 1 .048-.166a1.21 1.21 0 0 1 1.115-.068m-4.901 9.08l1.747.437l-.46-1.685A1.064 1.064 0 0 0 3.542 12c-.578 0-1.041.47-1.041 1.027c0 .471.32.882.778.996m6.697.437l1.747-.437c.457-.114.778-.525.778-.996c0-.557-.463-1.027-1.04-1.027c-.482 0-.903.324-1.026.775z"
          clip-rule="evenodd" />
      </symbol>
      <symbol id="gridicons--phone" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="M16 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2m-3 19h-2v-1h2zm3-2H8V5h8z" />
      </symbol>

      <symbol id="mdi--bell-outline" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="M10 21h4c0 1.1-.9 2-2 2s-2-.9-2-2m11-2v1H3v-1l2-2v-6c0-3.1 2-5.8 5-6.7V4c0-1.1.9-2 2-2s2 .9 2 2v.3c3 .9 5 3.6 5 6.7v6zm-4-8c0-2.8-2.2-5-5-5s-5 2.2-5 5v7h10z" />
      </symbol>

      <symbol id="mdi--web" viewBox="0 0 36 34">
        <path fill="currentColor"
          d="M16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M14.34 14H9.66c-.1-.66-.16-1.32-.16-2s.06-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2M12 19.96c-.83-1.2-1.5-2.53-1.91-3.96h3.82c-.41 1.43-1.08 2.76-1.91 3.96M8 8H5.08A7.92 7.92 0 0 1 9.4 4.44C8.8 5.55 8.35 6.75 8 8m-2.92 8H8c.35 1.25.8 2.45 1.4 3.56A8 8 0 0 1 5.08 16m-.82-2C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2M12 4.03c.83 1.2 1.5 2.54 1.91 3.97h-3.82c.41-1.43 1.08-2.77 1.91-3.97M18.92 8h-2.95a15.7 15.7 0 0 0-1.38-3.56c1.84.63 3.37 1.9 4.33 3.56M12 2C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2" />
      </symbol>

      <symbol id="fluent--list-16-filled" viewBox="0 0 16 16">
        <path fill="currentColor"
          d="M2 3.75A.75.75 0 0 1 2.75 3h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 2 3.75m0 8a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75M2.75 7a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5z" />
      </symbol>

      <symbol id="mdi--cart-outline" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="M17 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2M1 2h3.27l.94 2H20a1 1 0 0 1 1 1c0 .17-.05.34-.12.5l-3.58 6.47c-.34.61-1 1.03-1.75 1.03H8.1l-.9 1.63l-.03.12a.25.25 0 0 0 .25.25H19v2H7a2 2 0 0 1-2-2c0-.35.09-.68.24-.96l1.36-2.45L3 4H1zm6 16a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2m9-7l2.78-5H6.14l2.36 5z" />
      </symbol>

      <symbol id="material-symbols--search" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" />
      </symbol>

      <symbol id="fluent--apps-list-detail-24-regular" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="M4.25 4A2.25 2.25 0 0 0 2 6.25v2.5A2.25 2.25 0 0 0 4.25 11h2.5A2.25 2.25 0 0 0 9 8.75v-2.5A2.25 2.25 0 0 0 6.75 4zM3.5 6.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1-.75-.75zM11.25 5a.75.75 0 0 0 0 1.5h10a.75.75 0 0 0 0-1.5zm0 3a.75.75 0 0 0 0 1.5h7a.75.75 0 0 0 0-1.5zm-7 5A2.25 2.25 0 0 0 2 15.25v2.5A2.25 2.25 0 0 0 4.25 20h2.5A2.25 2.25 0 0 0 9 17.75v-2.5A2.25 2.25 0 0 0 6.75 13zm-.75 2.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1-.75-.75zM11.25 14a.75.75 0 0 0 0 1.5h10a.75.75 0 0 0 0-1.5zm0 3a.75.75 0 0 0 0 1.5h7a.75.75 0 0 0 0-1.5z" />
      </symbol>

      <symbol id="icon-park-outline--video" viewBox="0 0 48 48">
        <g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4">
          <path d="M4 10a2 2 0 0 1 2-2h36a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
          <path stroke-linecap="round"
            d="M36 8v32M12 8v32m26-22h6m-6 12h6M4 18h6m-6-2v4M9 8h6M9 40h6M33 8h6m-6 32h6M4 30h6m-6-2v4m40-4v4m0-16v4" />
          <path d="m21 19l8 5l-8 5z" />
        </g>
      </symbol>

      <symbol id="material-symbols--trophy" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="M7 21v-2h4v-3.1q-1.225-.275-2.187-1.037T7.4 12.95q-1.875-.225-3.137-1.637T3 8V7q0-.825.588-1.412T5 5h2V3h10v2h2q.825 0 1.413.588T21 7v1q0 1.9-1.263 3.313T16.6 12.95q-.45 1.15-1.412 1.913T13 15.9V19h4v2zm0-10.2V7H5v1q0 .95.55 1.713T7 10.8m10 0q.9-.325 1.45-1.088T19 8V7h-2z" />
      </symbol>

      <symbol id="material-symbols--share" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="M17 22q-1.25 0-2.125-.875T14 19q0-.15.075-.7L7.05 14.2q-.4.375-.925.588T5 15q-1.25 0-2.125-.875T2 12t.875-2.125T5 9q.6 0 1.125.213t.925.587l7.025-4.1q-.05-.175-.062-.337T14 5q0-1.25.875-2.125T17 2t2.125.875T20 5t-.875 2.125T17 8q-.6 0-1.125-.213T14.95 7.2l-7.025 4.1q.05.175.063.338T8 12t-.012.363t-.063.337l7.025 4.1q.4-.375.925-.587T17 16q1.25 0 2.125.875T20 19t-.875 2.125T17 22" />
      </symbol>

      <symbol id="mage--dots" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M12 5.92A.96.96 0 1 0 12 4a.96.96 0 0 0 0 1.92m0 7.04a.96.96 0 1 0 0-1.92a.96.96 0 0 0 0 1.92M12 20a.96.96 0 1 0 0-1.92a.96.96 0 0 0 0 1.92" />
      </symbol>

      <symbol id="ic--outline-email" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5l-8-5zm0 12H4V8l8 5l8-5z" />
      </symbol>

      <symbol id="ooui--next-ltr" viewBox="0 0 20 20">
        <path fill="currentColor" d="M7 1L5.6 2.5L13 10l-7.4 7.5L7 19l9-9z" />
      </symbol>
      <symbol id="grommet-icons--previous" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-width="2" d="M17 2L7 12l10 10" />
      </symbol>

      <symbol id="bi--alipay" viewBox="0 0 16 16">
        <g fill="currentColor">
          <path
            d="M2.541 0H13.5a2.55 2.55 0 0 1 2.54 2.563v8.297c-.006 0-.531-.046-2.978-.813c-.412-.14-.916-.327-1.479-.536q-.456-.17-.957-.353a13 13 0 0 0 1.325-3.373H8.822V4.649h3.831v-.634h-3.83V2.121H7.26c-.274 0-.274.273-.274.273v1.621H3.11v.634h3.875v1.136h-3.2v.634H9.99c-.227.789-.532 1.53-.894 2.202c-2.013-.67-4.161-1.212-5.51-.878c-.864.214-1.42.597-1.746.998c-1.499 1.84-.424 4.633 2.741 4.633c1.872 0 3.675-1.053 5.072-2.787c2.08 1.008 6.37 2.738 6.387 2.745v.105A2.55 2.55 0 0 1 13.5 16H2.541A2.55 2.55 0 0 1 0 13.437V2.563A2.55 2.55 0 0 1 2.541 0" />
          <path
            d="M2.309 9.27c-1.22 1.073-.49 3.034 1.978 3.034c1.434 0 2.868-.925 3.994-2.406c-1.602-.789-2.959-1.353-4.425-1.207c-.397.04-1.14.217-1.547.58Z" />
        </g>
      </symbol>

      <symbol id="solar--play-broken" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"
          d="M3 12v6.967c0 2.31 2.534 3.769 4.597 2.648l3.203-1.742M3 8V5.033c0-2.31 2.534-3.769 4.597-2.648l12.812 6.968a2.998 2.998 0 0 1 0 5.294l-6.406 3.484" />
      </symbol>
      <symbol id="raphael--quote" viewBox="0 0 32 32">
        <path fill="currentColor"
          d="M14.505 5.873Q8.6 9.654 8.6 14.98q0 1.657.577 1.657l.396-.107q.467-.18.756-.18q1.692 0 2.825 1.23t1.134 3.036q-.001 1.736-1.225 2.947q-1.224 1.21-2.952 1.21q-2.412 0-3.98-1.983q-1.564-1.98-1.564-4.977q-.001-3.39 1.33-6.203q1.334-2.812 4.068-5.085q2.736-2.271 3.492-2.272q.504 0 .828.486q.324.485.324.845l-.107.288zm12.96 0q-5.905 3.78-5.904 9.108q0 1.657.577 1.657l.396-.107q.467-.18.756-.18q1.656 0 2.807 1.23q1.153 1.228 1.152 3.036q-.001 1.736-1.225 2.947q-1.224 1.21-2.952 1.21q-2.412 0-3.98-1.983q-1.564-1.98-1.564-4.977q-.002-3.426 1.35-6.256q1.35-2.831 4.067-5.067q2.722-2.237 3.475-2.237q.505 0 .83.486q.323.486.323.846z" />
      </symbol>
      <symbol id="material-symbols--close" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z" />
      </symbol>
      <symbol id="line-md--heart-filled" viewBox="0 0 24 24">
        <path fill="currentColor" fill-opacity="0"
          d="M12 8c0 0 0 0 0.76 -1c0.88 -1.16 2.18 -2 3.74 -2c2.49 0 4.5 2.01 4.5 4.5c0 0.93 -0.28 1.79 -0.76 2.5c-0.81 1.21 -8.24 9 -8.24 9c0 0 -7.43 -7.79 -8.24 -9c-0.48 -0.71 -0.76 -1.57 -0.76 -2.5c0 -2.49 2.01 -4.5 4.5 -4.5c1.56 0 2.87 0.84 3.74 2c0.76 1 0.76 1 0.76 1Z">
          <animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.5s" values="0;1" />
        </path>
        <path fill="none" stroke="currentColor" stroke-dasharray="32" stroke-dashoffset="32" stroke-linecap="round"
          stroke-linejoin="round" stroke-width="2"
          d="M12 8c0 0 0 0 -0.76 -1c-0.88 -1.16 -2.18 -2 -3.74 -2c-2.49 0 -4.5 2.01 -4.5 4.5c0 0.93 0.28 1.79 0.76 2.5c0.81 1.21 8.24 9 8.24 9M12 8c0 0 0 0 0.76 -1c0.88 -1.16 2.18 -2 3.74 -2c2.49 0 4.5 2.01 4.5 4.5c0 0.93 -0.28 1.79 -0.76 2.5c-0.81 1.21 -8.24 9 -8.24 9">
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.7s" values="32;0" />
        </path>
      </symbol>
      <symbol id="mdi--user" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" />
      </symbol>
      <symbol id="material-symbols--chat-rounded" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="m6 18l-2.3 2.3q-.475.475-1.088.213T2 19.575V4q0-.825.588-1.412T4 2h16q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18zm1-4h6q.425 0 .713-.288T14 13t-.288-.712T13 12H7q-.425 0-.712.288T6 13t.288.713T7 14m0-3h10q.425 0 .713-.288T18 10t-.288-.712T17 9H7q-.425 0-.712.288T6 10t.288.713T7 11m0-3h10q.425 0 .713-.288T18 7t-.288-.712T17 6H7q-.425 0-.712.288T6 7t.288.713T7 8" />
      </symbol>
      <symbol id="ph--video-fill" viewBox="0 0 256 256">
        <path fill="currentColor"
          d="M232 208a8 8 0 0 1-8 8H32a8 8 0 0 1 0-16h192a8 8 0 0 1 8 8m0-152v112a16 16 0 0 1-16 16H40a16 16 0 0 1-16-16V56a16 16 0 0 1 16-16h176a16 16 0 0 1 16 16m-68 56a8 8 0 0 0-3.41-6.55l-40-28A8 8 0 0 0 108 84v56a8 8 0 0 0 12.59 6.55l40-28A8 8 0 0 0 164 112" />
      </symbol>
      <symbol id="lets-icons--clock" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="7" />
          <path stroke-linecap="round"
            d="M5.965 3.136a4 4 0 0 0-2.829 2.829m14.899-2.829a4 4 0 0 1 2.829 2.829M12 8v3.75c0 .138.112.25.25.25H15" />
        </g>
      </symbol>
      <symbol id="ic--baseline-wechat" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="M15.85 8.14c.39 0 .77.03 1.14.08C16.31 5.25 13.19 3 9.44 3c-4.25 0-7.7 2.88-7.7 6.43c0 2.05 1.15 3.86 2.94 5.04L3.67 16.5l2.76-1.19c.59.21 1.21.38 1.87.47c-.09-.39-.14-.79-.14-1.21c-.01-3.54 3.44-6.43 7.69-6.43M12 5.89a.96.96 0 1 1 0 1.92a.96.96 0 0 1 0-1.92M6.87 7.82a.96.96 0 1 1 0-1.92a.96.96 0 0 1 0 1.92" />
        <path fill="currentColor"
          d="M22.26 14.57c0-2.84-2.87-5.14-6.41-5.14s-6.41 2.3-6.41 5.14s2.87 5.14 6.41 5.14c.58 0 1.14-.08 1.67-.2L20.98 21l-1.2-2.4c1.5-.94 2.48-2.38 2.48-4.03m-8.34-.32a.96.96 0 1 1 .96-.96c.01.53-.43.96-.96.96m3.85 0a.96.96 0 1 1 0-1.92a.96.96 0 0 1 0 1.92" />
      </symbol>
    </defs>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IconSprite'
})
</script>