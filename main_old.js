  // AUTHOR: baihaqi43043@gmail.com

  function voiceToText(setting) {
    // ========== ASIGN  ID ===============
    _id_modalInfo = "__draft_result"
    _id_indicatorRecord = "__indicator_recording"
    _id_buttonRecord = "__click_to_convert"
    _id_reviewSpeech = ""
    // ========== END - ASIGN  ID ===============



    // ======== SETTING ============
    showDefaultButton = true
    isData = false
    isDataElementId = false
    contentButtonDefault = ""
    isContentButtonDefault = false
    isReviewSpeech = false
    isCustomClassButtonStop = false
    isCustomDefaultClassButtonStart = false
    // ======== END - SETTING ============



    // ======== CONDITIONAL OPTION ========
    if (setting != undefined) {
        if (setting.defaultButton != undefined) {
            showDefaultButton = setting.defaultButton
        }
        if (setting.customeButton != undefined) {
            _id_buttonRecord = setting.customeButton
        }
        if (setting.data != undefined) {
            isData = true
        }
        if (setting.dataElementId != undefined) {
            isDataElementId = true
        }
        if (setting.contentButtonDefault != undefined) {
            isContentButtonDefault = true
            contentButtonDefault = document.querySelector(setting.contentButtonDefault).innerHTML
        }
        if (setting.applySpeechTo != undefined) {
            isReviewSpeech = true
            _id_reviewSpeech = setting.applySpeechTo
        }
        if (setting.customClassButtonStop != undefined) {
            isCustomClassButtonStop = true
        }
        if (setting.customDefaultClassButtonStart != undefined) {
            isCustomDefaultClassButtonStart = true
        }
    }
    // ======== END - CONDITIONAL OPTION ========



    // ======== EMBEDDING UTILITIES ========
    let modalInfo = document.createElement(`div`)
    modalInfo.id = _id_modalInfo
    modalInfo.style.display = "none"

    let indicatorRecord = document.createElement(`div`)
    indicatorRecord.id = _id_indicatorRecord
    indicatorRecord.innerHTML = "&#10022; Recording"

    let buttonRecord = document.createElement(`button`)
    buttonRecord.id = _id_buttonRecord
    buttonRecord.innerHTML = "Voice To Text"

    // ======================================================
    document.querySelector("body").appendChild(modalInfo);

    if (showDefaultButton) {
        document.querySelector("body").appendChild(buttonRecord);
    }
    // ======================================================
    // ======== END - EMBEDDING UTILITIES ========



    // ======== SHORTCUT ELEMENT SELECTOR ======== 
    __modal_info_id = document.getElementById(_id_modalInfo)
    __indicator_record_id = document.getElementById(_id_indicatorRecord)

    __button_record_id = document.getElementById(_id_buttonRecord)
    // ======== END - SHORTCUT ELEMENT SELECTOR ========



    result = []
    draft = ""
    startSpeech = false

    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    recognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
        __modal_info_id.innerHTML = transcript
        draft = transcript
    })

    __button_record_id.addEventListener('click', function (e) {
        if (startSpeech) {
            if (isContentButtonDefault) {
                document.querySelector(setting.contentButtonDefault).innerHTML = contentButtonDefault
            } else {
                __button_record_id.innerHTML = contentButtonDefault
            }

            if (isCustomClassButtonStop) {
                __button_record_id.classList.remove(setting.customClassButtonStop)
            }

            if (isCustomDefaultClassButtonStart) {
                __button_record_id.classList.add(setting.customDefaultClassButtonStart)
            }

            document.getElementById(_id_indicatorRecord).remove()

            recognition.stop();
        } else {
            if (isContentButtonDefault) {
                document.querySelector(setting.contentButtonDefault).innerHTML = "STOP Recording"
            } else {
                __button_record_id.innerHTML = "STOP Recording"
            }
            
            if (isCustomDefaultClassButtonStart) {
                __button_record_id.classList.remove(setting.customDefaultClassButtonStart)
            }

            if (isCustomClassButtonStop) {
                __button_record_id.classList.add(setting.customClassButtonStop)
            }


            document.getElementsByTagName("body")[0].appendChild(indicatorRecord);

            recognition.start();
        }
        startSpeech = !startSpeech
    })

    __modal_info_id.addEventListener("change", function () {
        console.log("DRAFT BERUBAH")
    })

    var datasObj = {};
    if (isData) {
        var datas = setting.data;
        if (isDataElementId) {
            var assign = setting.dataElementId;
            for (let i = 0; i < assign.length; i++) {
                datasObj[assign[i]] = datas[i];
            }
        } else {
            datasObj = Object.assign({}, datas)
        }
    }

    recognition.addEventListener('end', function () {
        result.push(draft[0])
        draft.length = 0;

        if (startSpeech == true) {
            recognition.start();
            setTimeout(function () {
                __modal_info_id.style.display = "none"
            }, 1500)
        }

        let arr = [result.join(" ")]
        var cleanedArray = arr.map(function (item) {
            return item.replace(/\s+/g, ' ').trim();
        });

        if (isReviewSpeech) {
            document.querySelector(_id_reviewSpeech).innerHTML = cleanedArray[0]
        }

        var matchingData = {};

        for (var type in datasObj) {
            matchingData[type] = [];

            for (var i = 0; i < datasObj[type].length; i++) {
                if (cleanedArray[0].toLowerCase().includes(datasObj[type][i].toLowerCase())) {
                    matchingData[type].push(datasObj[type][i]);
                    matchingData[type] = matchingData[type].filter((value, index, self) => self.indexOf(value) === index);
                    
                    target = setting.dataElementId[i]
                    document.getElementById(type).innerHTML = matchingData[type]
                }
            }
        }
    });

    let observe = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList' && mutation.target === __modal_info_id) {
                __modal_info_id.style.display = "block"
            }
        })
    })

    let config = { childList: true };

    observe.observe(__modal_info_id, config)
    return
}