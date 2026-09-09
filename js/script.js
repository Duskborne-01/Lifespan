const steps = [
    {
        title: "Basic Information",
        questions: [
            {
                id: 'age',
                label: 'Current Age',
                type: 'number',
                min: 0,
                max: 120,
                default: 25
            },

            {
                type: 'select',
                label: 'Biological Sex',
                type: 'select',
                options: [
                    'Male',
                    'Female'
                ]
            },

            {
                id: 'country',
                label: 'Lifestyle Region',
                type: 'select',
                options: [
                    'Developed Nation',
                    'Developing Nation'
                ]
            }
        ]
    },

    {
        title: "Family History",
        questions: [
            {
                id: 'parents_age',
                label: 'Did in close family anyone live beyond 80?',
                type: 'select',
                options: [
                    'One',
                    'Two',
                    'Above Two',
                    'Neither'
                ]
            },

            {
                id: 'hereditary',
                label: 'Family history of heart disease/cancer?',
                type: 'select',
                options: [
                    'No',
                    'Yes'
                ]
            }
        ]
    },

    {
        title: 'Physical Activity',
        questions: [
            {
                id: 'exercise',
                label: 'How often do you exercise?',
                type: 'select',
                options: [
                    'Daily',
                    '3-5 times/week',
                    '1-2 times/week',
                    'Rarely',
                    'Never'
                ]
            },

            {
                id: 'sitting',
                label: 'Daily sitting hours',
                type: 'number',
                default: 8
            }
        ]
    },

    {
        title: "Nutrition",
        questions: [
            {
                id: 'diet',
                label: 'Diet Quality',
                type: 'select',
                options: [
                    'Excellent (whole foods)',
                    'Average',
                    'Poor (Fast food)'
                ]
            },

            {
                id: 'water',
                label: 'Daily Water Intake',
                type: 'select',
                options: [
                    'Sufficient',
                    'Moderate',
                    'Dehydrated'
                ]
            }
        ]
    },

    {
        title: "Sleep",
        questions: [
            {
                id: 'sleep',
                label: 'Average hours of sleep',
                type: 'select',
                options: [
                    '7-9 hours',
                    '5-6 hours',
                    'Less than 5'
                ]
            }
        ]
    },

    {
        title: "Mental Health",
        questions: [
            {
                id: 'stress',
                label: 'Stress Levels',
                type: 'select',
                options: [
                    'Low',
                    'Moderate',
                    'High'
                ]
            },

            {
                id: 'social',
                label: 'Strong Social Connections?',
                type: 'select',
                options: [
                    'Yes',
                    'No'
                ]
            }
        ]
    },

    {
        title: "Smoking & Vaping",
        questions: [
            {
                id: 'smoking',
                label: 'Smoking Status',
                type: 'select',
                options: [
                    'Never',
                    'Former',
                    'Occasional',
                    'Daily'
                ]
            }
        ]
    },

    {
        title: "Medical History",
        questions: [
            {
                id: 'bp',
                label: 'High Blood Pressure?',
                type: 'select',
                options: [
                    'No',
                    'Yes'
                ]
            },

            {
                id: 'diabetes',
                label: 'Diabetes?',
                type: 'select',
                options: [
                    'No',
                    'Yes'
                ]
            }
        ]
    },

    {
        title: "Environment",
        questions: [
            {
                id: 'pollution',
                label: 'Living Area Pollution',
                type: 'select',
                options: [
                    'Low',
                    'Medium',
                    'High'
                ]
            }
        ]
    },

    {
        title: "Lifestyle",
        questions: [
            {
                id: 'alcohol',
                label: 'Alcohol Use',
                type: 'select',
                options: [
                    'None/Rare',
                    'Moderate',
                    'Heavy'
                ]
            }
        ]
    }
];

let currentStep = 0;
let userData = {};
let countdownInterval;

const landingPage = document.getElementById('landing-page');
const questPage = document.getElementById('questionnaire-page');
const resultsPage = document.getElementById('results-page');
const startBtn = document.getElementById('start-btn');
const agreeCheck = document.getElementById('agree-check');
const stepContent = document.getElementById('step-content');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const downloadBtn = document.getElementById('dounload-btn');
const shareBtn = document.getElementById('share-btn');

agreeCheck.addEventListener('change', (e) => {
    startBtn.disabled = !e.target.checked;
});

startBtn.addEventListener('click', () => {
    landingPage.classList.remove('active');
    questPage.classList.add('active');

    renderStep();
});

function renderStep() {
    const step = steps[currentStep];
    progressText.innerText = `Step ${currentStep + 1} of ${steps.length}`;
    progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;

    let html = `<div class="step-group"><h2>${step.title}</h2>`;
    step.questions.forEach(q => {
        html += `<div class="question-item"><label>${q.label}</label>`;

        if (q.type === 'select') {
            html += `<select id="${q.id}">`;
            q.options.forEach(opt => {
                const selected = userData[q.id] === opt ? 'selected' : '';
                html += `<option value="${opt}" ${selected}>${opt}</option>`;
            });

            html += '</select>';
        } else {
            const value = userData[q.id] ?? q.default ?? '';
            const min = q.min !== undefined ? ` min="${q.min}"` : '';
            const max = q.max !== undefined ? ` max="${q.max}"` : '';
            html += `<input type="number" id="${q.id}" value="${value}"${min}${max} required>`;
        }

        html += `</div>`;
    });

    html += `</div>`;
    stepContent.innerHTML = html;

    prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-block';
    nextBtn.innerText = currentStep === steps.length - 1 ? 'Calculate' : 'Next';
}

nextBtn.addEventListener('click', () => {
    const questions = steps[currentStep].questions;
    const isValid = questions.every((q) => {
        const input = document.getElementById(q.id);
        if (!input.checkValidity()) {
            input.reportValidity();
            return false;
        }

        userData[q.id] = q.type === 'number' ? Number(input.value) : input.value;
        return true;
    });

    if (!isValid) return;

    if (currentStep < steps.length - 1) {
        currentStep++;

        renderStep();
    } else {
        calculateResults();
    }
});

prevBtn.addEventListener('click', () => {
    currentStep--;

    renderStep();
});

downloadBtn.addEventListener('click', () => {
    window.print();
});

shareBtn.addEventListener('click', async () => {
    const shareText = `My educational lifespan estimate is ${document.getElementById('estimated-total-age').innerText} years.`;

    if (navigator.share) {
        await navigator.share({
            title: 'My Lifespan Estimate',
            text: shareText
        });
        return;
    }

    await navigator.clipboard.writeText(shareText);
    shareBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
    setTimeout(() => {
        shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> Share';
    }, 2000);
});

function calculateResults() {
    let baseAge = userData.sex === 'Female' ? 82 : 78;
    let score = 70;
    const positives = [];
    const risks = [];

    const addPositive = (years, points, text) => {
        baseAge += years;
        score += points;
        positives.push(text);
    };
    const addRisk = (years, points, text) => {
        baseAge -= years;
        score -= points;
        risks.push(text);
    };

    if (userData.country === 'Developed Nation') {
        addPositive(2, 3, 'Access to healthcare and safer infrastructure can support longer, healthier lives.');
    } else {
        addRisk(1, 2, 'Healthcare access and environmental conditions can vary by region.');
    }

    if (userData.parents_age === 'Two' || userData.parents_age === 'Above Two') {
        addPositive(3, 6, 'Several close relatives lived past 80, suggesting a potentially favorable longevity pattern.');
    } else if (userData.parents_age === 'One') {
        addPositive(1, 2, 'One close relative lived past 80, which may indicate some favorable family history.');
    } else {
        addRisk(1, 2, 'No close relatives reported living past 80; family history is only one part of longevity.');
    }

    if (userData.hereditary === 'Yes') {
        addRisk(3, 6, 'A family history of heart disease or cancer makes preventive screening especially important.');
    } else {
        addPositive(1, 2, 'No family history of heart disease or cancer was reported.');
    }

    if (userData.exercise === 'Daily') {
        addPositive(4, 8, 'Daily movement supports cardiovascular fitness, mobility, and metabolic health.');
    } else if (userData.exercise === '3-5 times/week') {
        addPositive(2, 5, 'Regular exercise is a strong protective lifestyle factor.');
    } else if (userData.exercise === 'Never' || userData.exercise === 'Rarely') {
        addRisk(4, 8, 'Very little exercise may increase sedentary-lifestyle and cardiovascular risks.');
    } else {
        addPositive(1, 2, 'Some weekly exercise provides a modest health benefit.');
    }

    if (userData.sitting <= 6) {
        addPositive(1, 2, 'Lower daily sitting time supports mobility and overall activity levels.');
    } else if (userData.sitting >= 10) {
        addRisk(2, 4, 'Long periods of daily sitting can offset some exercise benefits.');
    }

    if (userData.diet === 'Excellent (whole foods)') {
        addPositive(4, 7, 'A whole-food diet can provide fiber and nutrients that support long-term health.');
    } else if (userData.diet === 'Poor (Fast food)') {
        addRisk(3, 6, 'A highly processed diet may increase cardiometabolic and nutrient-related risks.');
    } else {
        addPositive(1, 2, 'An average diet leaves room for improvement while providing a neutral baseline.');
    }

    if (userData.water === 'Sufficient') {
        addPositive(1, 2, 'Consistent hydration supports concentration, circulation, and daily function.');
    } else if (userData.water === 'Dehydrated') {
        addRisk(1, 2, 'Frequent dehydration can affect energy, concentration, and physical performance.');
    }

    if (userData.stress === 'High') {
        addRisk(3, 5, 'Persistent high stress can affect sleep, blood pressure, and long-term wellbeing.');
    } else if (userData.stress === 'Low') {
        addPositive(2, 4, 'Lower reported stress may support sleep quality and cardiovascular health.');
    }

    if (userData.sleep === '7-9 hours') {
        addPositive(2, 4, 'Seven to nine hours of sleep supports recovery, mood, and immune function.');
    } else if (userData.sleep === 'Less than 5') {
        addRisk(3, 5, 'Very short sleep can impair recovery, mood, and metabolic health.');
    } else {
        addRisk(1, 2, 'Five to six hours of sleep may be below the amount many adults need for recovery.');
    }

    if (userData.social === 'Yes') {
        addPositive(2, 4, 'Strong social connections are associated with resilience and healthier aging.');
    } else {
        addRisk(1, 2, 'Building supportive social connections may benefit emotional and physical wellbeing.');
    }

    if (userData.smoking === 'Never') {
        addPositive(3, 6, 'Never smoking avoids a major preventable source of cardiovascular and lung disease.');
    } else if (userData.smoking === 'Former') {
        addPositive(1, 2, 'Stopping smoking reduces health risks over time, especially when maintained.');
    } else if (userData.smoking === 'Daily') {
        addRisk(7, 12, 'Daily smoking is a significant risk to lung, heart, and vascular health.');
    } else {
        addRisk(3, 6, 'Occasional smoking still exposes the body to harmful chemicals and cardiovascular risk.');
    }

    if (userData.bp === 'Yes') {
        addRisk(4, 7, 'High blood pressure can quietly damage the heart and blood vessels without management.');
    } else {
        addPositive(1, 2, 'No high blood pressure was reported; routine checks are still worthwhile.');
    }

    if (userData.diabetes === 'Yes') {
        addRisk(5, 8, 'Diabetes requires ongoing management to reduce complications over time.');
    } else {
        addPositive(1, 2, 'No diabetes was reported, reducing one common long-term metabolic risk.');
    }

    if (userData.pollution === 'Low') {
        addPositive(1, 2, 'Lower pollution exposure may reduce respiratory and cardiovascular strain.');
    } else if (userData.pollution === 'High') {
        addRisk(2, 4, 'High pollution exposure can increase respiratory and cardiovascular stress.');
    }

    if (userData.alcohol === 'None/Rare') {
        addPositive(1, 2, 'Rare or no alcohol use avoids several alcohol-related health risks.');
    } else if (userData.alcohol === 'Heavy') {
        addRisk(5, 8, 'Heavy alcohol use can affect the liver, heart, sleep, and mental health.');
    } else {
        addRisk(1, 2, 'Moderate alcohol use can still affect sleep and long-term health for some people.');
    }

    score = Math.max(0, Math.min(100, score));
    const finalAge = Math.max(userData.age + 1, Math.min(105, baseAge));
    const remainingYears = finalAge - userData.age;

    displayResults(finalAge, remainingYears, score, positives, risks);
}

function displayResults(totalAge, remYears, score, positives, risks) {
    questPage.classList.remove('active');
    resultsPage.classList.add('active');

    document.getElementById('estimated-total-age').innerText = Math.round(totalAge);
    document.getElementById('health-score-val').innerText = score;
    document.getElementById('score-bar-fill').style.width = `${score}%`;

    const posList = document.getElementById('positive-list');
    const riskList = document.getElementById('risk-list');

    posList.innerHTML = positives.map(p => `<li><i class="fas fa-check"></i> ${p}</li>`).join('');
    riskList.innerHTML = risks.map(r => `<li><i class="fas fa-times"></i> ${r}</li>`).join('');

    const currentAge = userData.age;
    const progressPercent = Math.min(100, Math.max(0, (currentAge / totalAge) * 100));

    document.getElementById('timeline-fill').style.width = `${progressPercent}%`;
    document.getElementById('marker-current').style.left = `${progressPercent}%`;
    document.getElementById('marker-end').style.left = `100%`;
    document.getElementById('marker-end').querySelector("span").innerText = `Age ${Math.round(totalAge)}`;

    startCountdown(remYears);
}

function startCountdown(yearsLeft) {
    clearInterval(countdownInterval);
    let totalSeconds = Math.max(0, yearsLeft * 365.25 * 24 * 60 * 60);

    const updateCountdown = () => {
        const y = Math.floor(totalSeconds / (365.25 * 24 * 60 * 60));
        const mo = Math.floor((totalSeconds % (365.25 * 24 * 60 * 60)) / (30.44 * 24 * 60 * 60));
        const d = Math.floor((totalSeconds % (30.44 * 24 * 60 * 60)) / (24 * 60 * 60));
        const h = Math.floor((totalSeconds % (24 * 60 * 60)) / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = Math.floor(totalSeconds % 60);

        document.getElementById('rem-years').innerText = y;
        document.getElementById('rem-months').innerText = mo;
        document.getElementById('rem-days').innerText = d;
        document.getElementById('rem-hours').innerText = h;
        document.getElementById('rem-minutes').innerText = m;
        document.getElementById('rem-seconds').innerText = s;
    };

    updateCountdown();
    countdownInterval = setInterval(() => {
        totalSeconds = Math.max(0, totalSeconds - 1);
        updateCountdown();

        if (totalSeconds === 0) clearInterval(countdownInterval);
    }, 1000);
}
