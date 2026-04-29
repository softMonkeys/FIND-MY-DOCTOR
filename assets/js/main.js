async function handleContactSubmit(e) {
    e.preventDefault();
    const form = document.getElementById('contactForm');
    const status = document.getElementById('cf-status');
    const btn = form.querySelector('button[type="submit"]');

    // mirror email into hidden replyto field
    document.getElementById('cf-email-hidden').value = document.getElementById('cf-email').value;

    btn.disabled = true;
    btn.textContent = 'Sending…';

    try {
        const res = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {'Accept': 'application/json'}
        });

        if (res.ok) {
            form.reset();
            btn.style.display = 'none';
            status.style.display = 'block';
            status.style.background = 'rgba(41,171,226,0.12)';
            status.style.border = '1px solid rgba(41,171,226,0.3)';
            status.style.color = 'var(--sky)';
            status.textContent = '✓ Message sent — we\'ll be in touch shortly.';
        } else {
            throw new Error('Server error');
        }
    } catch {
        btn.disabled = false;
        btn.textContent = 'Send Message →';
        status.style.display = 'block';
        status.style.background = 'rgba(220,50,50,0.1)';
        status.style.border = '1px solid rgba(220,50,50,0.3)';
        status.style.color = '#f87171';
        status.textContent = 'Something went wrong — please email us directly at info@findmydr.ca';
    }
}


function toggleDrawer() {
    var d = document.getElementById('mobileDrawer');
    if (d.classList.contains('open')) {
        d.classList.remove('open');
    } else {
        d.classList.add('open');
    }
}

function goTo(page) {
    document.getElementById('mobileDrawer').classList.remove('open');
    showPage(page);
    return false;
}

// Attach hamburger events after DOM ready
document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('hamburgerBtn');
    if (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleDrawer();
        });
        btn.addEventListener('touchend', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleDrawer();
        });
    }
    // Drawer links
    var links = document.querySelectorAll('#mobileDrawer a');
    links.forEach(function (a) {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            var page = this.getAttribute('data-page');
            goTo(page);
        });
        a.addEventListener('touchend', function (e) {
            e.preventDefault();
            var page = this.getAttribute('data-page');
            goTo(page);
        });
    });
});

function syncHamburger() {
    if (window.innerWidth > 900) {
        document.getElementById('mobileDrawer').classList.remove('open');
    }
}

window.addEventListener('resize', syncHamburger);

function setSteps(a) {
    ["s1", "s2", "s3", "s4"].forEach((s, i) => {
        const el = document.getElementById(s);
        el.className = "ep-s";
        if (i < a - 1) el.classList.add("done"); else if (i === a - 1) el.classList.add("active");
    });
}

// Page switcher — show one page at a time
function showPage(pageName) {
    // Update sections
    document.querySelectorAll('section[data-page]').forEach(s => {
        s.classList.toggle('active', s.dataset.page === pageName);
    });
    // Update nav active state
    document.querySelectorAll('.nav-links a[data-nav]').forEach(a => {
        a.classList.toggle('active', a.dataset.nav === pageName);
    });
    // Scroll to top
    window.scrollTo({top: 0, behavior: 'instant'});
}

// Pillar click — toggle active state on click, only one active at a time
document.addEventListener('click', function (e) {
    var pillar = e.target.closest('.hiw-pillar');
    if (!pillar) return;
    var wasActive = pillar.classList.contains('active');
    // Clear all
    document.querySelectorAll('.hiw-pillar').forEach(p => p.classList.remove('active'));
    // Toggle: if it was already active, leave all cleared; otherwise activate this one
    if (!wasActive) pillar.classList.add('active');
});
setSteps(1);

// Force background video playback (handles browsers that block autoplay)
(function () {
    var v = document.getElementById("p1BgVideo");
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    var tryPlay = function () {
        var p = v.play();
        if (p !== undefined) {
            p.catch(function () {
                // If still blocked, attempt on first user interaction
                var resume = function () {
                    v.play().catch(function () {
                    });
                    document.removeEventListener("click", resume);
                    document.removeEventListener("touchstart", resume);
                    document.removeEventListener("keydown", resume);
                    document.removeEventListener("scroll", resume);
                };
                document.addEventListener("click", resume, {once: true});
                document.addEventListener("touchstart", resume, {once: true});
                document.addEventListener("keydown", resume, {once: true});
                document.addEventListener("scroll", resume, {once: true});
            });
        }
    };
    if (v.readyState >= 2) {
        tryPlay();
    } else {
        v.addEventListener("loadeddata", tryPlay, {once: true});
        v.addEventListener("canplay", tryPlay, {once: true});
    }
    // Retry once after window load in case the source was slow to negotiate
    window.addEventListener("load", function () {
        setTimeout(tryPlay, 200);
    });
})();

let extOpen = false;

function toggleExt() {
    extOpen = !extOpen;
    const p = document.getElementById("extPanel"), f = document.getElementById("extFab");
    if (extOpen) {
        p.classList.add("visible");
        f.classList.add("open");
        document.getElementById("fabBadge").style.display = "none";
    } else {
        p.classList.remove("visible");
        f.classList.remove("open");
    }
}

function closeExt() {
    extOpen = false;
    document.getElementById("extPanel").classList.remove("visible");
    document.getElementById("extFab").classList.remove("open");
}

function showView(id) {
    document.querySelectorAll(".ep-view").forEach(v => v.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function openAndMatch() {
    if (!extOpen) toggleExt();
    setTimeout(runMatch, 400);
}

function selectDoc(evt, name, sub, wait, dist, fax) {
    if (evt && evt.stopPropagation) evt.stopPropagation();
    setSteps(4);
    document.getElementById("sentSub").innerHTML = "Referral submitted to <strong>" + name + "</strong><br>EMR updated · Patient notification sent";
    document.getElementById("smsTxt").innerHTML = "<strong>Find My Doctor</strong><br>A referral has been submitted on your behalf to:<br><strong>" + name + " — " + sub + "</strong><br>Vancouver, BC<br>Estimated wait: " + wait + "<br>Enquiries: " + fax;
    showView("vSent");
}

function doManual() {
    const c = document.getElementById("afCard");
    c.style.display = "none";
    setTimeout(() => {
        const input = document.getElementById('mInp');

        const container = document.getElementById('vManual');
        if (!container) return;

        const cardsDiv = container.querySelector('.af-card');
        if (!cardsDiv) return;

        const searchedName = input ? input.value.trim() : '';
        const matches = findMatchesByName(searchedName);
        _lastManualMatches = matches; // Store matches for potential later use (e.g., selection)

        if (matches && matches.length > 0) {
            cardsDiv.innerHTML = matches.map((s, i) => {
                const isBest = i === 0;
                const waitLabel = s.wait ? '⏱ ' + s.wait : '⏱ Contact clinic';
                const cityLabel = '📍 ' + (s.city || 'BC');
                const faxLabel = s.fax ? '📠 ' + s.fax : (s.phone ? '📞 ' + s.phone : '');
                const subSpec = (s.specialty ? s.specialty.split(':')[0] : s.category) || s.category;

                return `<div class="spec-card${isBest ? ' best' : ''}">
            ${isBest ? '<div class="best-badge spec-rec">⭐ Recommended</div>' : ''}
            <div class="scard-name spec-name">${s.name}</div>
            <div class="scard-sub spec-sub">${subSpec}</div>
            ${s.interested ? '<div style="font-size:0.63rem;color:var(--muted);margin-bottom:0.35rem;">' + s.interested.substring(0, 80) + '</div>' : ''}
            <div class="scard-meta spec-meta">
              <span class="${isBest ? 'cg' : 'ca'}">${waitLabel}</span>
              <span class="${isBest ? 'cg' : 'ca'}">${cityLabel}</span>
              ${faxLabel ? '<span class="cm">' + faxLabel + '</span>' : ''}
            </div>
            ${s.hours ? '<div style="font-size:0.62rem;color:var(--muted);margin-top:0.25rem;">🕐 ' + s.hours + '</div>' : ''}
            <button style="margin-bottom: 1rem" class="sel-btn ${isBest ? 'sel-best' : 'sel-std'}" onclick="selectDocFromManual(${i})">Select &amp; Send Referral →</button>
          </div>`;
            }).join('');

        } else {
            // Show no match message
            cardsDiv.innerHTML = '<div style="padding:1rem;text-align:center;font-size:0.8rem;color:var(--muted);">No specialists found in the BC directory for this specialty. See AI search below ...</div>' +
                `<div class="spec-card best">
            <div class="best-badge spec-rec">⭐ AI Searched</div>
            <div class="scard-name spec-name">Dr. Sarah Kim</div>
            <div class="scard-sub spec-sub">dermatology</div>
            <div class="scard-meta spec-meta">
              <span class="cg">⏱ Contact clinic</span>
              <span class="'cg'">📍Vancouver</span>
              <span class="cm">📞 778-883-2696</span>
            </div>
            <div style="font-size:0.62rem;color:var(--muted);margin-top:0.25rem;">🕐 Mon-Fri 8:00 AM-5:00 PM</div>
          </div>`;
        }

        c.style.display = "block";

    }, 900);
}

function resetExt() {
    setSteps(1);
    showView("vIdle");
    document.getElementById("fabBadge").style.display = "flex";
}

setSteps(1);


// ═══════════════════════════════════════════════════════════════
//  FIND MY DOCTOR — BC Specialist Directory + Matching Engine
// ═══════════════════════════════════════════════════════════════

const BC_SPECIALISTS = [
    {
        id: 0,
        name: "Dr. Helen Heydari",
        specialty: "Family Physician",
        category: "Acupuncture",
        msp: "59568",
        address: "1722 Davie Street, Vancouver, BC, V6G 1W2",
        city: "Vancouver",
        phone: "604-428-7611",
        fax: "604-428-7612",
        hours: "Mon-Fri 8:30 AM-4:00 PM",
        wait: "",
        accepts: "Pain management (acupuncture, botulinum toxin for chronic migraine, trigger point injections); Skin conditions (cosmetic botulinum toxin)",
        interested: "Trigger point injections for non-opioid control of chronic pain",
        does_not: "Primary care maternity, mental health",
        virtual: true
    },
    {
        id: 1,
        name: "Dr. Toyin Adeyemo",
        specialty: "Psychiatry: Adult & Geriatric",
        category: "ADHD Psychiatry",
        msp: "66478",
        address: "235 Lansdowne Street, Kamloops, BC, V2C 1X8",
        city: "Kamloops",
        phone: "778-618-2091",
        fax: "778-309-6391",
        hours: "Thursday 9:00 AM-6:00 PM (lunch 12-1)",
        wait: "",
        accepts: "Psychiatry (Adult) - anxiety, bipolar, depression, early psychosis, eating disorders, OCD, panic, personality disorder, phobia, PTSD, reproductive psychiatry, sleep disorders, somatic symptom disorder; Geriatric psychiatry",
        interested: "",
        does_not: "",
        virtual: true
    },
    {
        id: 2,
        name: "Dr. Fidel Vila-Rodriguez",
        specialty: "Psychiatry: Adult",
        category: "ADHD Psychiatry",
        msp: "64980",
        address: "#228, 2155 Allison Road, Vancouver, BC, V6T 1T5",
        city: "Vancouver",
        phone: "604-222-2273",
        fax: "604-827-0530",
        hours: "Mon-Fri 8:00 AM-5:00 PM",
        wait: "",
        accepts: "Bipolar, Depression-adult, Early psychosis, Psychosis, TMS",
        interested: "Depression, bipolar disorder, psychosis",
        does_not: "",
        virtual: true
    },
    {
        id: 3,
        name: "Dr. Negar Bayat",
        specialty: "Psychiatry: Adult",
        category: "ADHD Psychiatry",
        msp: "59239",
        address: "100 - 3rd Street E, North Vancouver, BC, V7M 3N1",
        city: "North Vancouver",
        phone: "778-234-0541",
        fax: "778-234-0542",
        hours: "Mon-Tue 9:00 AM-4:00 PM (lunch 12-1)",
        wait: "",
        accepts: "Adult ADHD assessment, concurrent disorders, WorkSafeBC consultation in psychiatry",
        interested: "",
        does_not: "Bipolar/psychotic disorders, acute suicidal patients *Also cross-listed here: Dr. \"Venu Reddy\" Venugopal Karapareddy (see Addiction Medicine for full ",
        virtual: true
    },
    {
        id: 4,
        name: "Dr. George Luciuk",
        specialty: "Allergy & Immunology",
        category: "Allergist",
        msp: "06646",
        address: "#850, 6091 Gilbert Road, Richmond, BC, V7C 5L9",
        city: "Richmond",
        phone: "604-270-7801",
        fax: "604-270-3283",
        hours: "Mon-Wed 8:00 AM-3:00 PM; Thu 7:00 AM-2:00 PM; Fri 6:30",
        wait: "2-4 months (non-urgent)",
        accepts: "Pediatric allergy (testing, in-office), Allergy testing, Asthma, Consultations in-office, Desensitization (sub-q/sublingual immunotherapy adult), Immunology adult/pediatric",
        interested: "",
        does_not: "",
        virtual: true
    },
    {
        id: 5,
        name: "Dr. Seung Kim",
        specialty: "Allergy & Immunology",
        category: "Allergist",
        msp: "26435",
        address: "#600, 4980 Kingsway, Burnaby, BC, V5H 4K7",
        city: "Burnaby",
        phone: "604-433-0545",
        fax: "604-435-5550",
        hours: "Mon-Fri 9:00 AM-4:00 PM (lunch 12-1)",
        wait: "4-6 months (non-urgent)",
        accepts: "Pediatric allergy (no penicillin testing), Allergy testing, Asthma, Consultations, Desensitization, Immunology-adult",
        interested: "Immunotherapy, atopic dermatitis, asthma, clinical immunology",
        does_not: "Penicillin allergy testing",
        virtual: true
    },
    {
        id: 6,
        name: "Dr. Michael Pezim (Pezim Clinic)",
        specialty: "General Surgery",
        category: "Anal Dysplasia",
        msp: "05856",
        address: "#909, 750 W Broadway, Vancouver, BC, V5Z 1H8",
        city: "Vancouver",
        phone: "604-730-5810",
        fax: "604-730-5820",
        hours: "Mon-Wed 7:30 AM-4:30 PM",
        wait: "",
        accepts: "Anal diseases (fissures, neoplasms, hemorrhoid surgery), GI cancer (anal/rectal/colon), Sigmoidoscopy (rigid)",
        interested: "Expedited lower GI & anorectal disorders/cancers, hemorrhoids/fissures/fistulas, cosmetic anal surgery/tag removal, botulinum for anal fissure",
        does_not: "Anal warts (refer to STI Clinic), fecal incontinence, pilonidal sinus",
        virtual: true
    },
    {
        id: 7,
        name: "Dr. Gregory Polyakov",
        specialty: "General Surgery",
        category: "Anal Dysplasia",
        msp: "25467",
        address: "#503, 1750 E 10th Avenue, Vancouver, BC, V5N 5K4",
        city: "Vancouver",
        phone: "604-707-9171",
        fax: "604-707-9181",
        hours: "Mon-Fri 7:00 AM-7:00 PM; Sat 8:00 AM-2:30 PM",
        wait: "2-4 months (non-urgent)",
        accepts: "Abdominal, Anal, Breast (cancer/lump), Colonoscopy, General surgery, Ganglionectomy, Gastroscopy, Gynecomastia, Hepatobiliary, Laparoscopic surgery, Hernia repair, Pilonidal sinus, Sigmoidoscopy, Skin excisions/biopsy, Temporal artery biopsy, Thyroid surgery, Varicose vein surgery",
        interested: "Complex cases, hernias, hepatobiliary, endoscopies, lymph node biopsies",
        does_not: "Anal warts, patients under 17 **6. Anatomical Pathology** **Dr. Alvin Ip** *- Pain Medicine, PM&R, Sports Medicine, WorkSafeBC, MSP #36925* Accepting ",
        virtual: true
    },
    {
        id: 8,
        name: "Dr. Eitan Prisman",
        specialty: "ENT / Otolaryngology",
        category: "Audiology",
        msp: "68345",
        address: "2775 Laurel Street, Vancouver, BC, V5Z 1M9",
        city: "Vancouver",
        phone: "604-875-4126",
        fax: "604-875-4221",
        hours: "Mon-Fri 8:00 AM-3:00 PM (lunch 12-1); Closed",
        wait: "",
        accepts: "",
        interested: "Thyroid/parathyroid disease, cutaneous cancer, H&N cancer, laryngeal/tongue/thyroid cancer, facial nerve paralysis",
        does_not: "Eagle syndrome, sinus/nasal, epistaxis, deviated septum/sleep apnea, ears/tinnitus, hearing loss, vertigo, headaches",
        virtual: true
    },
    {
        id: 9,
        name: "Dr. Hardeep Mahal",
        specialty: "Cardiology",
        category: "Cardiology",
        msp: "60557",
        address: "#400, 1133 Lonsdale Avenue, North Vancouver, BC, V7M 2H4",
        city: "North Vancouver",
        phone: "604-980-1031",
        fax: "604-980-1032",
        hours: "Mon-Fri 8:30 AM-4:00 PM (lunch 12-1:30)",
        wait: "",
        accepts: "Ambulatory BP monitoring, Angina, Arrhythmia (AFib, hereditary), Cardiac event monitor, Cardiac stress test, Cardiomyopathy, Consultations (hospital/office), CAD, Dyslipidemia, ECG, Heart failure, Holter monitor, Hypertension, MI, Nutrition counselling, Obstetrical cardiology, Pacemaker device check",
        interested: "Ethnic heart disease, heart failure, sports cardiology, high risk occupational screening",
        does_not: "",
        virtual: true
    },
    {
        id: 10,
        name: "Dr. Eli Rosenberg",
        specialty: "Cardiology",
        category: "Cardiology",
        msp: "66533",
        address: "#1108, 777 W Broadway, Vancouver, BC, V5Z 4J7",
        city: "Vancouver",
        phone: "604-736-6441",
        fax: "604-736-6442",
        hours: "Mon-Fri 7:30 AM-3:30 PM (lunch 11-12)",
        wait: "",
        accepts: "Angina, Anticoagulation/thromboembolic (adult), Arrhythmia (AFib, EP, hereditary), Cancer cardio-oncology, Cardiac amyloidosis, Cardiomyopathy, Chest pain, CAD, Dyslipidemia, ECG, Heart failure, Hypertension, MI, Obstetrical cardiology, Sarcoidosis, Syncope, Valvular heart disease",
        interested: "Arrhythmia **9. Cardiovascular Surgery**",
        does_not: "New consultations outside of cardiac rehabilitation **Dr. Hamid Reza Bonakdar** *- Cardiology, MSP #J5949* Accepting consultative referrals; offers vi",
        virtual: true
    },
    {
        id: 11,
        name: "Dr. \"Jim\" James Abel",
        specialty: "Cardiac Surgery",
        category: "Cardiovascular Surgery",
        msp: "23252",
        address: "#4th Floor, 1081 Burrard Street, Vancouver, BC, V6Z 1Y6",
        city: "Vancouver",
        phone: "604-806-8503",
        fax: "604-806-9453",
        hours: "Mon-Fri 9:00 AM-5:00 PM",
        wait: "",
        accepts: "CABG, Cardiac surgery consultations (hospital/office), Pacemaker implant, Valvular heart disease (open heart valve surgery)",
        interested: "",
        does_not: "",
        virtual: true
    },
    {
        id: 12,
        name: "Dr. Anson Cheung",
        specialty: "Cardiac Surgery",
        category: "Cardiovascular Surgery",
        msp: "26262",
        address: "#4th Floor, 1081 Burrard Street, Vancouver, BC, V6Z 1Y6",
        city: "Vancouver",
        phone: "604-806-8282",
        fax: "604-806-9453",
        hours: "Mon-Fri 9:00 AM-5:00 PM",
        wait: "",
        accepts: "CABG (off pump), Cardiac surgery consultations (heart transplantation, ventricular assist device, ECMO, TMVI), Transcatheter aortic valve implantation (TAVI), Valvular heart disease (open/percutaneous)",
        interested: "",
        does_not: "",
        virtual: true
    },
    {
        id: 13,
        name: "Dr. Ross Chang",
        specialty: "Allergy & Immunology",
        category: "Clinical Immunology and Allergy",
        msp: "01424",
        address: "#600, 4980 Kingsway, Burnaby, BC, V5H 4K7",
        city: "Burnaby",
        phone: "604-433-0545",
        fax: "604-433-2846",
        hours: "Mon-Fri 9:15 AM-4:00 PM (lunch 12-1); also Saturday",
        wait: "4-6 months (non-urgent)",
        accepts: "Adverse drug reaction, Allergic conjunctivitis, Allergic rhinitis, Pediatric allergy (testing, in-office), Allergy testing (insect venom, penicillin, skin prick), Anaphylaxis, Angioedema, Asthma, Atopic dermatitis, Consultations, Desensitization (sub-q/sublingual adult), Food allergy desensitization",
        interested: "",
        does_not: "",
        virtual: true
    },
    {
        id: 14,
        name: "Dr. Jean-Noel Mahy",
        specialty: "General Surgery",
        category: "Colorectal Surgery",
        msp: "28522",
        address: "#525, 4789 Kingsway, Burnaby, BC, V5H 0A9",
        city: "Burnaby",
        phone: "604-438-3361",
        fax: "604-438-3362",
        hours: "Mon-Fri 9:00 AM-5:00 PM (lunch 12-1)",
        wait: "",
        accepts: "Abdominal surgery, Colonoscopy (any prior colonoscopy/pathology), Colorectal (bowel/colon cancer), General surgery consultations, GI cancer, Gastroscopy (progressive dysphagia, anemia, epigastric pain, gastric intestinal metaplasia), Hepatobiliary (distal pancreatic/liver lesions not HCC/cholangio),",
        interested: "General abdominal surgery, advanced laparoscopy, liver/pancreas, GI cancer, endoscopy",
        does_not: "Thyroid, breast, lesions of neck/arm/limb, anal condyloma, prolapse/incontinence, pilonidal, constipation/IBS/dyspepsia, hidradenitis suppurativa, gas",
        virtual: true
    },
    {
        id: 15,
        name: "Dr. Bahar Bahrani",
        specialty: "Dermatology",
        category: "Dermatology",
        msp: "36952",
        address: "505 Smithe Street, Vancouver, BC, V6B 6H1",
        city: "Vancouver",
        phone: "604-336-7462",
        fax: "604-336-7463",
        hours: "Mon-Fri 8:30 AM-6:00 PM; Sat 10:00 AM-5:00 PM",
        wait: "",
        accepts: "Acne, Adult dermatology, Anal dermatology (neoplasms), Atopic dermatitis, Congenital nevi, Consultations, Contact dermatitis, Cosmetic botulinum/dermatology, Cryotherapy, Drug eruption/rash, Erythema multiforme, Genital dermatoses (vulvar lichen sclerosis), Hyperhidrosis botulinum toxin, Nail disord",
        interested: "",
        does_not: "Hair loss",
        virtual: true
    },
    {
        id: 16,
        name: "Dr. Douglas Wu",
        specialty: "Dermatology",
        category: "Dermatology",
        msp: "44689",
        address: "#40, 3195 Granville Street, Vancouver, BC, V6H 3K2",
        city: "Vancouver",
        phone: "604-632-3290",
        fax: "833-664-4711",
        hours: "Mon-Fri 8:00 AM-5:00 PM",
        wait: "",
        accepts: "Acne, Congenital nevi, Cosmetic botulinum injections, Cosmetic dermatology, Hemangiomas, Hyperhidrosis botulinum, Laser skin treatment (melasma, vascular/pigmentary birthmarks, scar revision), Pediatric dermatology (cosmetic, laser), Rosacea, Vein sclerotherapy",
        interested: "",
        does_not: "General medical dermatology, generalized rashes (eczema/psoriasis), plastic surgical (face lift, breast aug, abdominoplasty), Mohs surgery **Red Flags",
        virtual: true
    },
    {
        id: 17,
        name: "Dr. Ran Ke",
        specialty: "Family Physician",
        category: "Dietician",
        msp: "68383",
        address: "4392 Beresford Street, Burnaby, BC, V5H 2Y4",
        city: "Burnaby",
        phone: "778-379-4392",
        fax: "778-379-4391",
        hours: "Mon-Fri 9:00 AM-4:00 PM",
        wait: "",
        accepts: "Bariatric medicine/obesity (medical weight loss, nutrition counselling), Enhanced Surgical Skill (FP-ESS) lipoma, Skin conditions (acne, skin cancer), Surgical procedures minor (I&D, ingrown toenail, wedge excision, skin excisions/biopsy), Women's health family medicine (birth control, contraceptive",
        interested: "Women's health, skin conditions, minor office procedures, nutrition/lifestyle counselling, reversing chronic diseases",
        does_not: "HRT, wrist injections **Urgent:** Fax or text 778-800-5540 **22. Endocrinology & Metabolism (incl. Endocrinology)**",
        virtual: true
    },
    {
        id: 18,
        name: "Dr. Ritu Kumar",
        specialty: "Endocrinology and Internal Medicine",
        category: "Endocrinology & Metabolism (incl. Endocrinology)",
        msp: "68416",
        address: "5037 Imperial Street, Burnaby, BC, V5J 0J3",
        city: "Burnaby",
        phone: "604-421-6880",
        fax: "604-421-8997",
        hours: "Mon-Fri 9:30 AM-5:30 PM (lunch 1:00-1:30)",
        wait: "",
        accepts: "Endocrinology (bariatric/obesity, diabetes, osteoporosis, thyroid disease); Internal Medicine (anticoagulation, bariatric, cardiology, consultations, endocrinology, GI, liver, nephrology, respirology, rheumatology)",
        interested: "Global management of diabetes, hypertension, dyslipidemia, osteoporosis, CV prevention, CAD, heart failure, arrhythmia",
        does_not: "Pediatric medicine (under 18) **Dr. Jusung Hwang** *- Endocrinology and Internal Medicine, MSP #58111* Accepting consultative referrals; offers virtua",
        virtual: true
    },
    {
        id: 19,
        name: "Dr. Eugene Lee",
        specialty: "Gastroenterology",
        category: "Gastroenterology",
        msp: "33518",
        address: "#250, 6091 Gilbert Road, Richmond, BC, V7C 5L9",
        city: "Richmond",
        phone: "604-273-4447",
        fax: "604-273-4254",
        hours: "Mon-Thu 9:00 AM-4:00 PM; Fri 9:00 AM-2:00 PM",
        wait: "",
        accepts: "Abdominal pain, Anal diseases (fissures, fecal incontinence), Celiac disease, Colitis, Colonoscopy, Constipation, Consultations (hospital/office), Diarrhea (VCH), Dyspepsia, Dysphagia, Eosinophilic esophagitis, Esophageal manometry, Esophagitis, GERD (VCH), GI bleed, Gastroscopy, Hepatitis (viral he",
        interested: "Any GI issues, liver disease (outside VCH accepted), hepatitis-B",
        does_not: "Referrals from naturopath investigations",
        virtual: true
    },
    {
        id: 20,
        name: "Dr. Victor Wong",
        specialty: "Gastroenterology",
        category: "Gastroenterology",
        msp: "29308",
        address: "#250, 6091 Gilbert Road, Richmond, BC, V7C 5L9",
        city: "Richmond",
        phone: "604-273-4447",
        fax: "604-273-4254",
        hours: "Mon-Thu 9:00 AM-4:00 PM; Fri 9:00 AM-2:00 PM",
        wait: "",
        accepts: "Colonoscopy, Consultations, Gastroscopy, IBD, Liver medicine, Sigmoidoscopy (flexible)",
        interested: "",
        does_not: "Hepatitis C or ERCP, patients under 18 **Red Flags:** Bloody diarrhea/rule out UC, severe weight loss, severe/sudden anemia **25. General Surgery**",
        virtual: true
    },
    {
        id: 21,
        name: "Dr. Kathy Lee",
        specialty: "General Surgery",
        category: "General Surgery",
        msp: "65681",
        address: "4651 No. 3 Road, Richmond, BC, V6X 2C4",
        city: "Richmond",
        phone: "604-303-7633",
        fax: "604-303-7611",
        hours: "Mon & Wed 9:00 AM-5:00 PM; Tue/Thu/Fri 9:00 AM-5:00 PM",
        wait: "",
        accepts: "Consultations in-office for general surgery (keloids, cysts, small lipomas, nevi, ingrown toenail surgical care, punch biopsies, ganglion cysts, lumps and bumps), Ganglionectomy, Pilonidal sinus surgery, Surgical skin excisions/biopsy (lipoma)",
        interested: "Keloid surgical care",
        does_not: "Hemorrhoid/perianal lesions (refer proctologist), core biopsies (refer hospital radiology), other general surgery (hernias, endoscopies) **Red Flags:*",
        virtual: true
    },
    {
        id: 22,
        name: "Dr. Rushad Udwadia",
        specialty: "General Surgery",
        category: "General Surgery",
        msp: "29137",
        address: "#100, 120 W 16th Street, North Vancouver, BC, V7M 3N6",
        city: "North Vancouver",
        phone: "604-985-3330",
        fax: "604-985-3316",
        hours: "Mon-Fri 9:00 AM-5:00 PM; Sat 9:00 AM-1:30 PM",
        wait: "",
        accepts: "Vein sclerotherapy (phlebectomy, ultrasound sclerotherapy)",
        interested: "Venous diseases, leg swelling/pain/cramps, restless legs, varicose/spider veins, functional and cosmetic disorders",
        does_not: "General surgery consultations **26. Genetics** **Early Pregnancy Assessment Clinic (EPAC)** *- BC Women's Hospital and Health Centre* Genetics, OB/GYN",
        virtual: true
    },
    {
        id: 23,
        name: "Dr. Keeva Lupton",
        specialty: "Geriatric Medicine",
        category: "Geriatric Medicine (incl. Geriatrics)",
        msp: "30881",
        address: "#9B, 1081 Burrard Street, Vancouver, BC, V6Z 1Y6",
        city: "Vancouver",
        phone: "604-806-8029",
        fax: "604-806-8390",
        hours: "Mon-Fri 9:00 AM-4:00 PM (lunch 12-1)",
        wait: "",
        accepts: "Anxiety-geriatric, Caregiver stress, Consultations (hospital/office), Delirium, Dementia/Alzheimers, Depression-geriatric, Failure to thrive-geriatric, Falls, Frailty, Geriatric assessments, Osteoarthritis, Osteoporosis, Polypharmacy",
        interested: "",
        does_not: "Capacity assessments, MAiD assessments **28. Gynecology**",
        virtual: true
    },
    {
        id: 24,
        name: "Dr. Cornel Smith",
        specialty: "Obstetrics / Gynecology",
        category: "Gynecology",
        msp: "68790",
        address: "#201, 3815 Sunset Street, Burnaby, BC, V5G 1T4",
        city: "Burnaby",
        phone: "236-521-7252",
        fax: "236-521-7253",
        hours: "Tue & Fri 9:30 AM-12:00 PM; Wed & Thu 9:30 AM-3:30 PM",
        wait: "",
        accepts: "Abnormal uterine bleeding, Cervix (cervical polyp), Non-surgical gynecology, Contraceptive implant, Endometrial sample, Endometriosis, IUD insertion, Infertility, Menopause (HRT/counselling), Osteoporosis, Ovary, PCOS, Urinary incontinence-female, Vagina (mass/lesion, vaginismus, vaginitis), Vulva (",
        interested: "",
        does_not: "Prenatal care, surgical consults, prolapse/incontinence, patients under 18 **Red Flags:** PMB, severe bleeding/pain, suspected cancer",
        virtual: true
    },
    {
        id: 25,
        name: "Dr. Maryse Larouche",
        specialty: "Obstetrics / Gynecology",
        category: "Gynecology",
        msp: "66857",
        address: "#3rd Floor, 1081 Burrard Street, Vancouver, BC, V6Z 1Y6",
        city: "Vancouver",
        phone: "604-800-4224",
        fax: "604-398-8408",
        hours: "Mon-Thu 9:00 AM-12:00 PM",
        wait: "",
        accepts: "Surgical gynecology consultation, Fecal incontinence, Pelvic organ prolapse (incl. surgery), Urinary incontinence-female, Urogynecology (fellowship accreditation)",
        interested: "",
        does_not: "General gynecology, IUD insertions/removals, dysmenorrhea **Hospital Privileges:** BC Women's, St. Paul's **Dr. Olga Moukhortova-Darnall** *- Obstetri",
        virtual: true
    },
    {
        id: 26,
        name: "Dr. Tym Frank",
        specialty: "Orthopedics and WorkSafeBC",
        category: "Hand Physiotherapy",
        msp: "62866",
        address: "#202, 3825 Sunset Street, Burnaby, BC, V5G 1T4",
        city: "Burnaby",
        phone: "604-294-8209",
        fax: "604-294-8614",
        hours: "Mon-Fri 9:00 AM-3:30 PM (lunch 12-1)",
        wait: "",
        accepts: "Orthopedics (casts, consultations hospital/office, elbow - arthroplasty/arthroscopy/fractures, ganglionectomy, hand - arthroplasty/Dupuytren's/fractures/trigger finger, joint injection elbow/hand/shoulder, shoulder - AC separation/arthroplasty/arthroscopy/biceps tendon/dislocation/fractures/rotator ",
        interested: "Shoulder, elbow, wrist, hand",
        does_not: "Lower limb reconstruction **Red Flags:** Any concerning upper limb pathology **30. Hematology**",
        virtual: true
    },
    {
        id: 27,
        name: "Dr. Erica Peterson",
        specialty: "Hematology",
        category: "Hematology",
        msp: "66678",
        address: "#10th floor, 2775 Laurel Street, Vancouver, BC, V5Z 1M9",
        city: "Vancouver",
        phone: "604-875-5270",
        fax: "604-675-3883",
        hours: "Mon-Fri 8:00 AM-3:30 PM",
        wait: "",
        accepts: "Anemias and red blood cell disorders-adult (hemolytic), Anticoagulation/thromboembolic disease-adult (anticoagulant options, anticoagulation management, DVT, peri-op management, PE), Bleeding disorders/coagulopathy-adult (hemophilia-adult), Bone marrow/stem cell transplantation-adult, Consultations ",
        interested: "",
        does_not: "",
        virtual: true
    },
    {
        id: 28,
        name: "Dr. Chantal Leger",
        specialty: "Hematology",
        category: "Hematology",
        msp: "27027",
        address: "#411, 1200 Burrard Street, Vancouver, BC, V6Z 2C7",
        city: "Vancouver",
        phone: "236-479-0498",
        fax: "236-443-2911",
        hours: "Mon-Fri 8:00 AM-5:00 PM",
        wait: "4-6 months (non-urgent)",
        accepts: "Consultations in-hospital/office for hematology, Hematological cancer",
        interested: "",
        does_not: "",
        virtual: true
    },
    {
        id: 29,
        name: "Dr. Brian Conway",
        specialty: "Infectious Disease",
        category: "Infectious Diseases",
        msp: "24011",
        address: "#Main Floor, 1177 Hornby Street, Vancouver, BC, V6Z 2E9",
        city: "Vancouver",
        phone: "604-642-6429",
        fax: "604-642-6419",
        hours: "Mon-Fri 9:00 AM-5:00 PM",
        wait: "",
        accepts: "Consultations (infectious disease, internal medicine), HIV, Hepatitis (viral, Hep-C)",
        interested: "HIV, hepatitis, infectious diseases **Red Flags:** HIV and HCV",
        does_not: "",
        virtual: true
    },
    {
        id: 30,
        name: "Dr. John Farley",
        specialty: "Infectious Disease",
        category: "Infectious Diseases",
        msp: "06941",
        address: "1199 Main Street, Vancouver, BC, V6A 4B6",
        city: "Vancouver",
        phone: "604-687-1147",
        fax: "1-844-270-0942",
        hours: "Mon-Thu 10:00 AM-4:00 PM (lunch 12-1)",
        wait: "",
        accepts: "HIV, HIV pre-exposure prophylaxis (PrEP), Hepatitis (HBV/HCV/HIV, Hep-C), Liver fibrosis scan (Fibroscan) on-site",
        interested: "Hepatitis B, hepatitis C **Red Flags:** Any type of hepatitis **32. Internal Medicine** *Dr. Jaikaran Singh (cross-listed - see section 21 Dietician for full details)*",
        does_not: "",
        virtual: true
    },
    {
        id: 31,
        name: "Dr. Chaoran Zhang",
        specialty: "Internal Medicine",
        category: "Internal Medicine",
        msp: "30898",
        address: "#910, 943 W Broadway, Vancouver, BC, V5Z 4E1",
        city: "Vancouver",
        phone: "604-731-1123",
        fax: "604-282-6320",
        hours: "Mon-Fri 10:00 AM-4:00 PM (lunch 12-1); Open Saturday",
        wait: "",
        accepts: "Anticoagulation/thromboembolic (DVT/PE, peri-op, pulmonary embolism), Bariatric medicine/obesity (weight loss mgmt, nutrition counselling), Cardiology (arrhythmia AFib, CAD, dyslipidemia, hypertension, MI, syncope), Consultations (hospital/office), Endocrinology (diabetes, hypercalcemia, hyperparath",
        interested: "Obesity, hypertension, diabetes mellitus, dyslipidemia, peri-op medicine, weight loss NYD, cough **Urgent:** Email **33. Iron Infusion** **Rapid Access Pain Clinic - Dr Yu** *- Anesthesiology and Pain",
        does_not: "Pharmacotherapy or prescription writing **34. Massage Therapy** **Dr. Smeeta Desai-Ranchod** *- Family Physician - Pain Medicine, MSP #23413* Acceptin",
        virtual: true
    },
    {
        id: 32,
        name: "Dr. Brenda Tan",
        specialty: "Family Physician",
        category: "Midwifery",
        msp: "26217",
        address: "#2186, 3779 Sexsmith Road, Richmond, BC, V6X 3Z9",
        city: "Richmond",
        phone: "778-297-7992",
        fax: "778-297-7995",
        hours: "Mon-Fri 8:30 AM-5:00 PM (lunch 1-2); Sat 8:30 AM-1:00",
        wait: "",
        accepts: "Women's health family medicine (primary care maternity)",
        interested: "Primary care maternity - antepartum, intrapartum, postpartum",
        does_not: "",
        virtual: true
    },
    {
        id: 33,
        name: "Dr. \"Marianne\" Minju Park",
        specialty: "Nephrology",
        category: "Nephrology",
        msp: "33660",
        address: "#201, 3040 Tutt Street, Kelowna, BC, V1Y 2H5",
        city: "Kelowna",
        phone: "778-484-5111",
        fax: "250-980-3227",
        hours: "Mon-Thu 9:00 AM-4:00 PM; Closed most Fri, all",
        wait: "4-6 months (non-urgent)",
        accepts: "Consultations in-hospital/office for nephrology, Dialysis, Glomerulonephritis, Hematuria, Kidney transplant, Proteinuria (Forward Care Medical - Vancouver), Renal cystic disease, Renal failure (Forward Care Medical - Vancouver)",
        interested: "",
        does_not: "",
        virtual: true
    },
    {
        id: 34,
        name: "Dr. Mostafa Fatehi Hassanabad",
        specialty: "Neurosurgery",
        category: "Neurosurgery",
        msp: "59030",
        address: "#8th floor, 2775 Laurel Street, Vancouver, BC, V5Z 1M9",
        city: "Vancouver",
        phone: "604-875-5540",
        fax: "604-630-7086",
        hours: "Mon-Fri 8:00 AM-4:00 PM",
        wait: "",
        accepts: "Brain cancer, Brain hemorrhage (intracerebral), Brain trauma, Consultations (hospital/office), ICBC cases, Increased intracranial pressure, Intracranial mass, WorkSafeBC consultation in neurosurgery (expedited)",
        interested: "Brain tumors, epilepsy surgery",
        does_not: "Spine surgery, peripheral nerve surgery, Chiari malformations",
        virtual: true
    },
    {
        id: 35,
        name: "Dr. Gary Redekop",
        specialty: "Neurosurgery",
        category: "Neurosurgery",
        msp: "23817",
        address: "#8115, 2775 Laurel Street, Vancouver, BC, V5Z 1M9",
        city: "Vancouver",
        phone: "604-875-5235",
        fax: "604-875-5280",
        hours: "Mon-Fri 8:00 AM-5:00 PM",
        wait: "",
        accepts: "Brain aneurysms, Brain cancer, Brain hemorrhage (intracerebral, subarachnoid), Brain trauma, Carotid surgery, Consultations (hospital/office), Hydrocephalus, Increased intracranial pressure, Intracranial mass, Trigeminal neuralgia, VP shunt",
        interested: "",
        does_not: "Spine surgery **41. Nuclear Medicine** **Medical Imaging - Burnaby Hospital (FHA)** Accepting consultative referrals Weight limits: CT 500 lbs, Fluoro",
        virtual: true
    },
    {
        id: 36,
        name: "Dr. John Tierney",
        specialty: "Obstetrics / Gynecology",
        category: "Obstetrics and Gynecology",
        msp: "67083",
        address: "#100, 145 W 15th Street, North Vancouver, BC, V7M 1R5",
        city: "North Vancouver",
        phone: "877-858-7573",
        fax: "604-998-7573",
        hours: "Mon-Fri 8:00 AM-4:00 PM",
        wait: "",
        accepts: "Abnormal uterine bleeding, Bartholin's cyst, Cervix (cervical polyp), Non-surgical gynecology, Endometrial sample, IUD insertion, Infertility, Menopause (HRT/counselling), Osteoporosis, Ovary, Pelvic organ prolapse (non-surgical, pessaries), Sexual wellness, Urinary incontinence-female, Vagina (mass",
        interested: "Abnormal uterine bleeding, menopause, contraception, non-surgical prolapse management, vulval skin conditions",
        does_not: "Termination of pregnancy, prenatal patients *Also cross-listed here: Dr. Maryse Larouche, Dr. Olga Moukhortova-Darnall (see Gynecology section 28 for ",
        virtual: true
    },
    {
        id: 37,
        name: "Dr. Heather O'Donnell",
        specialty: "Ophthalmology",
        category: "Ophthalmology (incl. Optometry)",
        msp: "68293",
        address: "#510, 1200 Burrard Street, Vancouver, BC, V6Z 2C7",
        city: "Vancouver",
        phone: "604-564-0254",
        fax: "604-428-0255",
        hours: "Mon-Fri 7:30 AM-4:00 PM (lunch 12-1)",
        wait: "",
        accepts: "Cataract surgery, Consultations (hospital/office), Cornea (corneal abrasion, corneal ulcers), Eyelid (blepharoplasty, eyelid ptosis), Glaucoma, Inflammatory eye conditions (iritis/uveitis, scleritis), Pediatric ophthalmology (must be over 8 years old), Pediatric ophthalmology procedures (must be ove",
        interested: "Comprehensive ophthalmic consultations",
        does_not: "Children under 8 years, glasses prescriptions **Red Flags:** Conditions that may compromise vision",
        virtual: true
    },
    {
        id: 38,
        name: "Dr. Suruchi Bhui",
        specialty: "Ophthalmology",
        category: "Ophthalmology (incl. Optometry)",
        msp: "59630",
        address: "#251, 8138 - 128th Street, Surrey, BC, V3W 1R1",
        city: "Surrey",
        phone: "236-598-8343",
        fax: "778-372-4272",
        hours: "Mon-Fri 7:00 AM-5:00 PM",
        wait: "",
        accepts: "General ophthalmology, Consultations in-office for ophthalmology, Retinal disease (macular degeneration, retinal surgery)",
        interested: "Diabetic eye screening, any retinal disease",
        does_not: "",
        virtual: true
    },
    {
        id: 39,
        name: "Dr. Kenneth Hughes",
        specialty: "Orthopedics",
        category: "Orthopedic Surgery (incl. Orthopedics)",
        msp: "00247",
        address: "#310, 6091 Gilbert Road, Richmond, BC, V7C 5L9",
        city: "Richmond",
        phone: "604-273-6148",
        fax: "604-284-5161",
        hours: "Mon-Fri 9:15 AM-3:45 PM (lunch 11:45 AM-1:15 PM)",
        wait: "",
        accepts: "Consultations in-office for orthopedics, Foot (bunion surgery - standing AP + lateral/oblique), Hip (arthroplasty - X-ray AP + lateral, arthroscopy), Joint aspiration, Joint injection (knee), Joint viscosupplementation-private pay, Knee (arthroplasty - X-ray standing AP + lateral skyline patella, ar",
        interested: "Hip and knee arthroplasty/osteoarthritis",
        does_not: "Backs, surgical services **Red Flags:** Urgent orthopedic question **Hospital Privileges:** Richmond Hospital, UBC Health Sciences Centre **Dr. Jillia",
        virtual: true
    },
    {
        id: 40,
        name: "Dr. Adrian Indar",
        specialty: "General Surgery",
        category: "Otolaryngology - Head and Neck Surgery",
        msp: "37539",
        address: "#2, 1877 Marine Drive, North Vancouver, BC, V7P 1V5",
        city: "North Vancouver",
        phone: "236-521-9406",
        fax: "236-521-9416",
        hours: "Mon-Fri 9:00 AM-5:00 PM",
        wait: "",
        accepts: "Surgical skin excisions or biopsy (lipoma)",
        interested: "Benign naevi, seborrhoeic keratosis, common warts (verrucae), lipomata, uncomplicated benign dermal, epidermal cysts, telangiectasias, angiomata of the skin, skin tags, fibroepithelial polyps, papillo",
        does_not: "",
        virtual: true
    },
    {
        id: 41,
        name: "Dr. Nazmudin Bhanji",
        specialty: "Pediatrics",
        category: "Paediatrics",
        msp: "00611",
        address: "7263 Fraser Street, Vancouver, BC, V5X 3V8",
        city: "Vancouver",
        phone: "604-322-1440",
        fax: "604-398-4213",
        hours: "Mon-Fri 10:00 AM-5:00 PM (lunch 1-2)",
        wait: "",
        accepts: "General pediatrics, ADHD/Attention deficit assessment-pediatric, Pediatric allergy (consultations, desensitization sub-q/sublingual immunotherapy, food allergy desensitization), Asthma-pediatric, Autism, Behaviour problems, Celiac disease-pediatric, Cerebral palsy, Congenital disease, Congenital hea",
        interested: "All pediatric issues **Dr. Wyncel Chan** *- Pediatrics, MSP #Q2090* Accepting consultative referrals; offers virtual care by video English and Tagalog spoken **VyCare Medical Clinic** **Address:** #21",
        does_not: "Concussion, disordered eating, hallucinations **Red Flags:** Newborn failure to thrive, worsening headaches with loss of balance/blurry vision/vomitin",
        virtual: true
    },
    {
        id: 42,
        name: "Dr. Hannah Piper",
        specialty: "General Surgery",
        category: "Pediatric General Surgery",
        msp: "62696",
        address: "#K0-134, 4480 Oak Street, Vancouver, BC, V6H 3N1",
        city: "Vancouver",
        phone: "604-875-2667",
        fax: "604-642-8890",
        hours: "Mon-Fri 7:30 AM-3:30 PM (lunch 12-1)",
        wait: "",
        accepts: "Pediatric general surgery (consultations hospital/office, pediatric abdominal surgery, pediatric laparoscopic hernia, pediatric liver surgery), Pilonidal sinus surgery, Splenic surgery, Stoma assessment, Venous access - port/implantable venous access device (IVAD)",
        interested: "",
        does_not: "Patients over 17 years of age **Hospital Privileges:** BC Children's Hospital **53. Pediatrics** *Dr. Nazmudin Bhanji (cross-listed from Paediatrics -",
        virtual: true
    },
    {
        id: 43,
        name: "Dr. Malcolm Kim Sing",
        specialty: "Pediatrics",
        category: "Pediatrics",
        msp: "03646",
        address: "#108, 3825 Sunset Street, Burnaby, BC, V5G 1T4",
        city: "Burnaby",
        phone: "604-433-5750",
        fax: "604-431-6228",
        hours: "Mon-Fri 9:00 AM-4:00 PM",
        wait: "",
        accepts: "ADHD assessment-pediatric, Adolescent medicine, Pediatric allergy, Behaviour problems, Child abuse/maltreatment, Congenital disease, Consultations (hospital/office), Developmental delay (language delay), Eating disorders (child/youth), Failure to thrive-pediatric, Sexual abuse **Hospital Privileges:",
        interested: "",
        does_not: "",
        virtual: true
    },
    {
        id: 44,
        name: "Dr. Joy Wee",
        specialty: "Physical Medicine & Rehabilitation",
        category: "Physical Medicine and Rehabilitation (incl. Physiotherapy)",
        msp: "25264",
        address: "#301, 1770 W 7th Avenue, Vancouver, BC, V6J 4Y6",
        city: "Vancouver",
        phone: "604-359-5494",
        fax: "604-738-1587",
        hours: "Mon-Fri 9:00 AM-5:00 PM",
        wait: "",
        accepts: "Acquired brain injury, Ankle, Aphasia, Back, Cerebral palsy, Concussion, Consultations in-office for physical medicine and rehabilitation, Elbow (epicondylitis), Foot, Hand, Hip, Interventional pain procedures (trigger point injections), Joint injection (knee, shoulder), Knee, MS, Neck, Parkinson's ",
        interested: "",
        does_not: "Prolotherapy, private-pay consults **55. Plastic Surgery**",
        virtual: true
    },
    {
        id: 45,
        name: "Dr. Daniel McKee",
        specialty: "Plastic Surgery",
        category: "Plastic Surgery",
        msp: "62281",
        address: "#104, 3965 Kingsway, Burnaby, BC, V5H 1Y8",
        city: "Burnaby",
        phone: "604-259-7660",
        fax: "800-886-3077",
        hours: "Mon-Fri 8:00 AM-4:00 PM",
        wait: "",
        accepts: "Consultations in-office for plastic surgery, Cosmetic plastic surgery (abdominoplasty, cosmetic blepharoplasty, facial, gynecologic cosmetic surgery, liposuction), Eyelid, Gender-affirming surgery (top surgery - mastectomy female-to-male), Gynecomastia (private-pay only, not covered by MSP), Skin ca",
        interested: "Cosmetic procedures - gynecomastia, breast lift, eyelid blepharoplasty, neck lift",
        does_not: "Breast cancer reconstruction, foot lesions/masses, panniculectomy, wrist pathology (SLAC, carpal bone trauma, chronic wrist), nail pathology **Hospita",
        virtual: true
    },
    {
        id: 46,
        name: "Dr. Ross Horton",
        specialty: "Plastic Surgery",
        category: "Plastic Surgery",
        msp: "07311",
        address: "#505, 4885 Kingsway, Burnaby, BC, V5H 4T2",
        city: "Burnaby",
        phone: "604-435-8483",
        fax: "604-435-8409",
        hours: "Mon-Fri 9:30 AM-4:30 PM (lunch 12-1)",
        wait: "",
        accepts: "Consultations in-office for plastic surgery, Cosmetic botulinum toxin injections, Cosmetic plastic surgery (cosmetic blepharoplasty, cosmetic laser), Eyelid (blepharoplasty, eyelid ptosis - upper eyelid blepharoplasty MSP or private pay), Gynecomastia, Hand (carpal tunnel surgery, Dupuytren's, trigg",
        interested: "Skin cancers, trigger fingers",
        does_not: "Wrist disorders, wrist ganglions, wrist pain, below the knee non-cancerous issues",
        virtual: true
    },
];

// Category → array of OSCAR specialty strings it maps to
const CATEGORY_MAP = {
    "Acupuncture": ["Acupuncture"],
    "Addiction Medicine": ["Addictions Medicine"],
    "ADHD Psychiatry": ["ADHD Psychiatry", "Psychiatry", "Neuropsychiatry"],
    "Allergist": ["Allergist", "Clinical Immunology and Allergy"],
    "Anal Dysplasia": ["Anal Dysplasia", "High Resolution Anoscopy", "Colorectal Surgery"],
    "Audiology": ["Audiology"],
    "Cardiology": ["Cardiology"],
    "Cardiovascular Surgery": ["CardioVascular Surgery"],
    "Clinical Immunology and Allergy": ["Clinical Immunology and Allergy", "Allergist"],
    "Colorectal Surgery": ["Colorectal Surgery", "Anal Dysplasia"],
    "Dermatology": ["Dermatology"],
    "Dietician": ["Dietician", "Diabetes Education"],
    "Endocrinology & Metabolism (incl. Endocrinology)": ["Endocrinology & Metabolism", "Endocrinology and Metabolism", "Diabetes Education"],
    "Gastroenterology": ["Gastroenterology"],
    "General Surgery": ["General Surgery", "Pediatric General Surgery"],
    "Geriatric Medicine (incl. Geriatrics)": ["Geriatric Medicine", "Geriatrics"],
    "Gynecology": ["Gynecology", "Obstetrics and Gynecology"],
    "Hand Physiotherapy": ["Hand Physiotherapy", "Physiotherapy", "Physical Medicine and Rehabilitation"],
    "Hematology": ["Hematology"],
    "Infectious Diseases": ["Infectious Diseases"],
    "Internal Medicine": ["Internal Medicine"],
    "Midwifery": ["Midwifery"],
    "Nephrology": ["Nephrology"],
    "Neurosurgery": ["Neurosurgery", "Neurology"],
    "Obstetrics and Gynecology": ["Obstetrics and Gynecology", "Gynecology"],
    "Ophthalmology (incl. Optometry)": ["Ophthalmology", "Optometry"],
    "Orthopedic Surgery (incl. Orthopedics)": ["Orthopedic Surgery", "Orthopedics"],
    "Otolaryngology - Head and Neck Surgery": ["Otolaryngology - Head and Neck Surgery", "Otolaryngology"],
    "Paediatrics": ["Paediatrics", "Pediatrics"],
    "Pediatric General Surgery": ["Pediatric General Surgery", "General Surgery"],
    "Pediatrics": ["Pediatrics", "Paediatrics"],
    "Physical Medicine and Rehabilitation (incl. Physiotherapy)": ["Physical Medicine and Rehabilitation", "Physiotherapy", "Rehabilitation"],
    "Plastic Surgery": ["Plastic Surgery"],
};

// Wait-time string → number of days (estimate)
function waitDays(s) {
    if (!s) return 30;
    const m = s.match(/(\d+)\s*[-–]\s*(\d+)\s*(month|week|day)/i);
    if (!m) return 30;
    const lo = parseInt(m[1]), hi = parseInt(m[2]);
    const mid = (lo + hi) / 2;
    if (/month/i.test(m[3])) return mid * 30;
    if (/week/i.test(m[3])) return mid * 7;
    return mid;
}

// City → rough distance bucket from Vancouver (lower = closer)
function cityDistanceBucket(city) {
    const c = (city || "").toLowerCase();
    if (c.includes("vancouver") && !c.includes("north") && !c.includes("west")) return 1;
    if (c.includes("burnaby") || c.includes("new westminster")) return 2;
    if (c.includes("richmond") || c.includes("north van") || c.includes("west van")) return 2;
    if (c.includes("coquitlam") || c.includes("surrey") || c.includes("delta")) return 3;
    if (c.includes("langley") || c.includes("abbotsford") || c.includes("chilliwack")) return 4;
    if (c.includes("victoria") || c.includes("nanaimo")) return 5;
    if (c.includes("kelowna") || c.includes("kamloops") || c.includes("prince")) return 6;
    return 3; // default: lower mainland
}

// ── MAIN MATCHING FUNCTION ──────────────────────────────────────
function findMatches(oscarSpecialty, reasonText) {
    const spec = (oscarSpecialty || "").toLowerCase().trim();
    const reason = (reasonText || "").toLowerCase();

    // 1. Find all specialists whose category maps to the selected OSCAR specialty
    let candidates = BC_SPECIALISTS.filter(s => {
        const cats = CATEGORY_MAP[s.category] || [s.category];
        return cats.some(c => c.toLowerCase() === spec) ||
            s.category.toLowerCase() === spec ||
            s.specialty.toLowerCase().includes(spec.split(" ")[0]) ||
            s.category.toLowerCase().includes(spec.split(" ")[0]);
    });

    // 2. If no direct match, do fuzzy: any specialist whose accepts/interested
    //    field contains any word from the specialty
    if (candidates.length === 0) {
        const words = spec.split(/\s+/).filter(w => w.length > 3);
        candidates = BC_SPECIALISTS.filter(s =>
            words.some(w =>
                s.accepts.toLowerCase().includes(w) ||
                s.interested.toLowerCase().includes(w) ||
                s.category.toLowerCase().includes(w)
            )
        );
    }

    // 3. Score each candidate
    candidates = candidates.map(s => {
        let score = 100; // base

        // Sub-specialty relevance: check if reason text matches their interests
        if (reason && s.interested) {
            const interestWords = s.interested.toLowerCase().split(/[\s,;]+/);
            const reasonWords = reason.split(/\s+/);
            const matches = reasonWords.filter(w => w.length > 3 && interestWords.some(iw => iw.includes(w) || w.includes(iw)));
            score += matches.length * 15; // big boost for sub-specialty match
        }

        // Wait time: shorter = better
        const days = waitDays(s.wait);
        score -= days * 0.5; // mild penalty for longer waits

        // Proximity: closer = better
        const dist = cityDistanceBucket(s.city);
        score -= dist * 8;

        // Virtual care bonus (accessible)
        if (s.virtual) score += 5;

        // Does not see: check if reason triggers exclusion
        if (s.does_not && reason) {
            const exclusions = s.does_not.toLowerCase();
            const reasonWords = reason.split(/\s+/);
            if (reasonWords.some(w => w.length > 3 && exclusions.includes(w))) {
                score -= 100; // likely wrong match
            }
        }

        return {...s, score: Math.round(score)};
    });

    // 4. Sort by score descending, return top 3
    candidates.sort((a, b) => b.score - a.score);
    return candidates.slice(0, 3);
}


// Store last matches globally for index-based selection
let _lastMatches = [];
let _lastManualMatches = [];

function renderMatchCards(matches, specialty) {
    _lastMatches = matches;
    const container = document.getElementById('vResults');
    if (!container) return;

    const lbl = document.getElementById('resLbl');
    if (lbl) lbl.textContent = 'Best matches — ' + specialty + ' · BC';

    const cardsDiv = container.querySelector('.scards');
    if (!cardsDiv) return;

    if (!matches || matches.length === 0) {
        cardsDiv.innerHTML = '<div style="padding:1rem;text-align:center;font-size:0.8rem;color:var(--muted);">No specialists found in the BC directory for this specialty.<br>Try manual search below.</div>';
        return;
    }

    cardsDiv.innerHTML = matches.map((s, i) => {
        const isBest = i === 0;
        const waitLabel = s.wait ? '⏱ ' + s.wait : '⏱ Contact clinic';
        const cityLabel = '📍 ' + (s.city || 'BC');
        const faxLabel = s.fax ? '📠 ' + s.fax : (s.phone ? '📞 ' + s.phone : '');
        const subSpec = (s.specialty ? s.specialty.split(':')[0] : s.category) || s.category;

        return `<div class="spec-card${isBest ? ' best' : ''}">
            ${isBest ? '<div class="best-badge spec-rec">⭐ Recommended</div>' : ''}
            <div class="scard-name spec-name">${s.name}</div>
            <div class="scard-sub spec-sub">${subSpec}</div>
            ${s.interested ? '<div style="font-size:0.63rem;color:var(--muted);margin-bottom:0.35rem;">' + s.interested.substring(0, 80) + '</div>' : ''}
            <div class="scard-meta spec-meta">
              <span class="${isBest ? 'cg' : 'ca'}">${waitLabel}</span>
              <span class="${isBest ? 'cg' : 'ca'}">${cityLabel}</span>
              ${faxLabel ? '<span class="cm">' + faxLabel + '</span>' : ''}
            </div>
            ${s.hours ? '<div style="font-size:0.62rem;color:var(--muted);margin-top:0.25rem;">🕐 ' + s.hours + '</div>' : ''}
            <button class="sel-btn ${isBest ? 'sel-best' : 'sel-std'}" onclick="selectDocByIndex(${i})">Select &amp; Send Referral →</button>
          </div>`;
    }).join('');
}

function selectDocByIndex(i) {
    const s = _lastMatches[i];
    if (!s) return;
    selectDocFromDir(s);
}

function selectDocFromManual(i) {
    const s = _lastManualMatches[i];
    if (!s) return;
    selectDocFromDir(s);
}


// ── POPULATE OSCAR FORM FIELDS WHEN SPECIALIST SELECTED ─────────
function selectDocFromDir(s) {
    // Fill OSCAR Consultation Request form fields
    const fConsultant = document.getElementById('consultantName');
    if (fConsultant) fConsultant.value = s.name || '';
    const fPhone = document.getElementById('consultPhone');
    if (fPhone) fPhone.value = s.phone || '';
    const fFax = document.getElementById('consultFax');
    if (fFax) fFax.value = s.fax || '';
    const fAddr = document.getElementById('consultAddr');
    if (fAddr) fAddr.value = s.address || '';

    const name = s.name || 'Specialist';
    const sub = (s.specialty ? s.specialty.split(':')[0] : s.category) || s.category || '';
    const wait = s.wait || 'Contact clinic';
    const fax = s.fax || s.phone || 'See referral';

    // Show step 3 "sending" briefly
    setSteps(3);
    // Animate ss1/ss2 if they exist
    ['ss1', 'ss2'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.className = 'ep-s';
            el.classList.add('active');
        }
    });

    setTimeout(() => {
        ['ss1', 'ss2'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.className = 'ep-s done';
        });

        const sentSub = document.getElementById('sentSub');
        if (sentSub) sentSub.innerHTML = 'Referral submitted to <strong>' + name + '</strong><br>EMR updated · Patient notification sent';

        const smsTxt = document.getElementById('smsTxt');
        if (smsTxt) smsTxt.innerHTML = '<strong>Find My Doctor</strong><br>A referral has been submitted on your behalf to:<br><strong>' + name + ' — ' + sub + '</strong><br>' + (s.address || 'Vancouver, BC') + '<br>Estimated wait: ' + wait + '<br>Enquiries: ' + fax;

        setSteps(4);
        showView('vSent');
    }, 1400);
}

// ── OVERRIDE runMatch TO USE REAL DATA ──────────────────────────
function runMatch() {
    const specEl = document.getElementById('emrSpec');
    const reasonEl = document.getElementById('emrReason');
    const sp = specEl ? specEl.value : 'Dermatology';
    const reason = reasonEl ? reasonEl.value : '';

    const subLbl = document.getElementById('matchSub');
    if (subLbl) subLbl.textContent = 'Searching BC directory for: ' + sp + '…';

    setSteps(2);
    showView('vMatch');

    setTimeout(() => {
        const matches = findMatches(sp, reason);
        setSteps(3);
        showView('vResults');
        renderMatchCards(matches, sp);
    }, 2200);
}

// ── FIND MATCHES BY NAME FUNCTION ──────────────────────────────────────
function findMatchesByName(searchedName) {
    const name = (searchedName || "").toLowerCase().trim();
    const candidates = BC_SPECIALISTS.filter(s => s.name.toLowerCase().includes(name));
    return candidates.length > 0 ? candidates : false;
}
