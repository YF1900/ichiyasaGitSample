/**
 * Interactive Video Proposal AI Assistant
 * Main application logic
 */

(function () {
  'use strict';

  // ========================================
  // State
  // ========================================
  const state = {
    apiKey: '',
    industry: '',
    product: '',
    inputType: 'challenge',
    challenge: '',
    goal: '',
    useCases: [],
    selectedUseCase: null,
    detailProposal: null,
  };

  // ========================================
  // DOM References
  // ========================================
  const dom = {
    // API Key
    apiKeyInput: document.getElementById('api-key'),
    toggleKeyBtn: document.getElementById('toggle-key-visibility'),
    saveKeyBtn: document.getElementById('save-api-key'),
    apiKeyStatus: document.getElementById('api-key-status'),
    apiKeySection: document.getElementById('api-key-section'),

    // Step sections
    stepInput: document.getElementById('step-input'),
    stepUsecases: document.getElementById('step-usecases'),
    stepDetail: document.getElementById('step-detail'),

    // Form
    inputForm: document.getElementById('input-form'),
    industrySelect: document.getElementById('industry'),
    industryOther: document.getElementById('industry-other'),
    productInput: document.getElementById('product'),
    challengeGroup: document.getElementById('challenge-group'),
    goalGroup: document.getElementById('goal-group'),
    challengeInput: document.getElementById('challenge'),
    goalInput: document.getElementById('goal'),
    generateBtn: document.getElementById('generate-btn'),

    // Use cases
    usecasesList: document.getElementById('usecases-list'),
    inputSummary: document.getElementById('input-summary'),
    backToInputBtn: document.getElementById('back-to-input'),
    regenerateBtn: document.getElementById('regenerate-btn'),

    // Detail
    detailTitle: document.getElementById('detail-title'),
    detailLoading: document.getElementById('detail-loading'),
    detailContent: document.getElementById('detail-content'),
    detailScenario: document.getElementById('detail-scenario'),
    detailChallenges: document.getElementById('detail-challenges'),
    detailResults: document.getElementById('detail-results'),
    detailRoi: document.getElementById('detail-roi'),
    backToUsecasesBtn: document.getElementById('back-to-usecases'),
    exportBtn: document.getElementById('export-btn'),
  };

  // ========================================
  // API Key Management
  // ========================================
  function loadApiKey() {
    const saved = localStorage.getItem('openai_api_key');
    if (saved) {
      state.apiKey = saved;
      dom.apiKeyInput.value = saved;
      showStatus(dom.apiKeyStatus, 'APIキーが設定済みです', 'success');
    }
  }

  function saveApiKey() {
    const key = dom.apiKeyInput.value.trim();
    if (!key) {
      showStatus(dom.apiKeyStatus, 'APIキーを入力してください', 'error');
      return;
    }
    if (!key.startsWith('sk-')) {
      showStatus(dom.apiKeyStatus, 'APIキーの形式が正しくありません（sk-で始まる必要があります）', 'error');
      return;
    }
    state.apiKey = key;
    localStorage.setItem('openai_api_key', key);
    showStatus(dom.apiKeyStatus, 'APIキーを保存しました', 'success');
  }

  function toggleKeyVisibility() {
    const input = dom.apiKeyInput;
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  // ========================================
  // OpenAI API
  // ========================================
  async function callOpenAI(systemPrompt, userPrompt) {
    if (!state.apiKey) {
      throw new Error('APIキーが設定されていません。上部でOpenAI APIキーを設定してください。');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      if (response.status === 401) {
        throw new Error('APIキーが無効です。正しいキーを設定してください。');
      }
      if (response.status === 429) {
        throw new Error('APIのレート制限に達しました。しばらく待ってから再度お試しください。');
      }
      throw new Error(err.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // ========================================
  // Use Case Generation
  // ========================================
  async function generateUseCases() {
    const industry = state.industry;
    const product = state.product;
    const inputType = state.inputType;
    const context = inputType === 'challenge' ? state.challenge : state.goal;
    const contextLabel = inputType === 'challenge' ? '課題' : '実施したいゴール';

    const systemPrompt = `あなたはインタラクティブ動画の専門コンサルタントです。
インタラクティブ動画とは、視聴者が動画内でクリック・タップ・選択などのアクションを行える次世代の動画フォーマットです。
分岐シナリオ、クイズ、商品選択、フォーム入力、シミュレーションなど様々なインタラクション要素を組み込めます。

あなたの役割は、クライアントの業界・商材・課題/ゴールに基づき、インタラクティブ動画の具体的なユースケースを提案することです。

回答は必ず以下のJSON形式で返してください。他のテキストは含めないでください:
{
  "useCases": [
    {
      "title": "ユースケースのタイトル（20文字以内）",
      "summary": "ユースケースの概要説明（80文字以内）",
      "category": "カテゴリ（マーケティング/営業支援/顧客教育/採用/社内研修/カスタマーサポート/ブランディング/EC/プロモーション/その他）"
    }
  ]
}`;

    const userPrompt = `以下のクライアント情報に基づき、インタラクティブ動画のユースケースを10個提案してください。

【業界】${industry}
【取り扱い商材・サービス】${product}
【${contextLabel}】${context}

各ユースケースは具体的で実行可能なものにしてください。
それぞれ異なるアプローチ・目的を持つ多様な提案をお願いします。`;

    const result = await callOpenAI(systemPrompt, userPrompt);

    // Parse JSON from response
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AIからの応答を解析できませんでした。再度お試しください。');
    }
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.useCases;
  }

  // ========================================
  // Detail Proposal Generation
  // ========================================
  async function generateDetailProposal(useCase) {
    const industry = state.industry;
    const product = state.product;
    const inputType = state.inputType;
    const context = inputType === 'challenge' ? state.challenge : state.goal;
    const contextLabel = inputType === 'challenge' ? '課題' : '実施したいゴール';

    const systemPrompt = `あなたはインタラクティブ動画の専門コンサルタントであり、動画制作の企画ディレクターです。
選ばれたユースケースについて、具体的な動画シナリオと効果予測を含む詳細な提案を作成してください。

回答は必ず以下のJSON形式で返してください。他のテキストは含めないでください:
{
  "scenario": {
    "overview": "動画全体の概要（100文字程度）",
    "duration": "想定動画尺（例: 3〜5分）",
    "scenes": [
      {
        "sceneNumber": 1,
        "title": "シーンタイトル",
        "description": "シーンの内容説明",
        "interaction": "このシーンでのインタラクション要素（クリック、選択肢、入力等）",
        "duration": "想定秒数"
      }
    ],
    "branchingPoints": "分岐ポイントの説明"
  },
  "challenges": [
    {
      "title": "想定課題のタイトル",
      "description": "課題の詳細説明",
      "mitigation": "対策・軽減策"
    }
  ],
  "results": [
    {
      "metric": "指標名",
      "currentEstimate": "現状の推定値",
      "expectedImprovement": "改善後の推定値",
      "description": "改善の根拠説明"
    }
  ],
  "roi": {
    "investmentEstimate": "概算投資額の範囲",
    "expectedReturn": "期待される効果の金銭換算",
    "paybackPeriod": "投資回収期間の目安",
    "roiPercentage": "想定ROI（%）",
    "assumptions": "ROI算出の前提条件",
    "additionalBenefits": ["副次的な効果1", "副次的な効果2"]
  }
}`;

    const userPrompt = `以下の情報に基づき、選ばれたユースケースの詳細提案を作成してください。

【業界】${industry}
【取り扱い商材・サービス】${product}
【${contextLabel}】${context}

【選択されたユースケース】
タイトル: ${useCase.title}
概要: ${useCase.summary}
カテゴリ: ${useCase.category}

動画シナリオは5〜8シーンで構成し、各シーンにインタラクション要素を含めてください。
想定課題は3〜4つ、想定結果は4〜5つの指標を含めてください。
ROIは具体的な数値感を含む現実的な見積もりにしてください。`;

    const result = await callOpenAI(systemPrompt, userPrompt);

    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AIからの応答を解析できませんでした。再度お試しください。');
    }
    return JSON.parse(jsonMatch[0]);
  }

  // ========================================
  // Rendering
  // ========================================
  function renderUseCases(useCases) {
    dom.usecasesList.innerHTML = '';

    useCases.forEach((uc, index) => {
      const card = document.createElement('div');
      card.className = 'usecase-card';
      card.innerHTML = `
        <span class="usecase-number">${index + 1}</span>
        <h4>${escapeHtml(uc.title)}</h4>
        <p>${escapeHtml(uc.summary)}</p>
        <span class="usecase-arrow">&rarr;</span>
      `;
      card.addEventListener('click', () => selectUseCase(index));
      dom.usecasesList.appendChild(card);
    });
  }

  function renderDetailProposal(proposal) {
    // Scenario
    let scenarioHtml = `<p><strong>概要:</strong> ${escapeHtml(proposal.scenario.overview)}</p>`;
    scenarioHtml += `<p><strong>想定動画尺:</strong> ${escapeHtml(proposal.scenario.duration)}</p>`;

    if (proposal.scenario.scenes) {
      proposal.scenario.scenes.forEach((scene) => {
        scenarioHtml += `
          <div class="scene">
            <div class="scene-title">シーン${scene.sceneNumber}: ${escapeHtml(scene.title)}（${escapeHtml(scene.duration)}）</div>
            <p>${escapeHtml(scene.description)}</p>
            <p><strong>インタラクション:</strong> ${escapeHtml(scene.interaction)}</p>
          </div>`;
      });
    }

    if (proposal.scenario.branchingPoints) {
      scenarioHtml += `<p><strong>分岐ポイント:</strong> ${escapeHtml(proposal.scenario.branchingPoints)}</p>`;
    }
    dom.detailScenario.innerHTML = scenarioHtml;

    // Challenges
    let challengesHtml = '';
    if (proposal.challenges) {
      proposal.challenges.forEach((ch) => {
        challengesHtml += `
          <h4>${escapeHtml(ch.title)}</h4>
          <p>${escapeHtml(ch.description)}</p>
          <p><strong>対策:</strong> ${escapeHtml(ch.mitigation)}</p>`;
      });
    }
    dom.detailChallenges.innerHTML = challengesHtml;

    // Results
    let resultsHtml = '<ul>';
    if (proposal.results) {
      proposal.results.forEach((r) => {
        resultsHtml += `
          <li>
            <strong>${escapeHtml(r.metric)}</strong><br>
            <span class="metric">${escapeHtml(r.currentEstimate)}</span>
            &rarr;
            <span class="metric">${escapeHtml(r.expectedImprovement)}</span>
            <p>${escapeHtml(r.description)}</p>
          </li>`;
      });
    }
    resultsHtml += '</ul>';
    dom.detailResults.innerHTML = resultsHtml;

    // ROI
    let roiHtml = '';
    if (proposal.roi) {
      roiHtml += `
        <div class="roi-highlight">
          <div class="roi-value">ROI: ${escapeHtml(proposal.roi.roiPercentage)}</div>
          <p>投資回収期間: ${escapeHtml(proposal.roi.paybackPeriod)}</p>
        </div>
        <h4>投資概算</h4>
        <p>${escapeHtml(proposal.roi.investmentEstimate)}</p>
        <h4>期待リターン</h4>
        <p>${escapeHtml(proposal.roi.expectedReturn)}</p>
        <h4>前提条件</h4>
        <p>${escapeHtml(proposal.roi.assumptions)}</p>`;

      if (proposal.roi.additionalBenefits && proposal.roi.additionalBenefits.length > 0) {
        roiHtml += '<h4>副次的な効果</h4><ul>';
        proposal.roi.additionalBenefits.forEach((b) => {
          roiHtml += `<li>${escapeHtml(b)}</li>`;
        });
        roiHtml += '</ul>';
      }
    }
    dom.detailRoi.innerHTML = roiHtml;
  }

  // ========================================
  // Navigation
  // ========================================
  function showStep(step) {
    dom.stepInput.classList.add('hidden');
    dom.stepUsecases.classList.add('hidden');
    dom.stepDetail.classList.add('hidden');

    switch (step) {
      case 'input':
        dom.stepInput.classList.remove('hidden');
        break;
      case 'usecases':
        dom.stepUsecases.classList.remove('hidden');
        break;
      case 'detail':
        dom.stepDetail.classList.remove('hidden');
        break;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ========================================
  // Event Handlers
  // ========================================
  function handleInputTypeChange() {
    const radios = document.querySelectorAll('input[name="input-type"]');
    radios.forEach((radio) => {
      radio.addEventListener('change', (e) => {
        state.inputType = e.target.value;
        if (e.target.value === 'challenge') {
          dom.challengeGroup.classList.remove('hidden');
          dom.goalGroup.classList.add('hidden');
        } else {
          dom.challengeGroup.classList.add('hidden');
          dom.goalGroup.classList.remove('hidden');
        }
      });
    });
  }

  function handleIndustryChange() {
    dom.industrySelect.addEventListener('change', () => {
      if (dom.industrySelect.value === 'その他') {
        dom.industryOther.classList.remove('hidden');
      } else {
        dom.industryOther.classList.add('hidden');
      }
    });
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    // Collect state
    state.industry =
      dom.industrySelect.value === 'その他'
        ? dom.industryOther.value.trim()
        : dom.industrySelect.value;
    state.product = dom.productInput.value.trim();
    state.challenge = dom.challengeInput.value.trim();
    state.goal = dom.goalInput.value.trim();

    // Validate
    if (!state.industry) {
      alert('業界を選択してください。');
      return;
    }
    if (!state.product) {
      alert('取り扱い商材・サービスを入力してください。');
      return;
    }
    const context = state.inputType === 'challenge' ? state.challenge : state.goal;
    if (!context) {
      alert(state.inputType === 'challenge' ? '課題を入力してください。' : 'ゴールを入力してください。');
      return;
    }

    // Show loading
    setGenerateLoading(true);

    try {
      const useCases = await generateUseCases();
      state.useCases = useCases;

      // Set summary
      const contextLabel = state.inputType === 'challenge' ? '課題' : 'ゴール';
      dom.inputSummary.textContent = `${state.industry} | ${state.product} | ${contextLabel}: ${context}`;

      renderUseCases(useCases);
      showStep('usecases');
    } catch (err) {
      alert('エラーが発生しました:\n' + err.message);
    } finally {
      setGenerateLoading(false);
    }
  }

  async function selectUseCase(index) {
    const useCase = state.useCases[index];
    state.selectedUseCase = useCase;

    dom.detailTitle.textContent = useCase.title;
    dom.detailLoading.classList.remove('hidden');
    dom.detailContent.classList.add('hidden');

    showStep('detail');

    try {
      const proposal = await generateDetailProposal(useCase);
      state.detailProposal = proposal;
      renderDetailProposal(proposal);
      dom.detailLoading.classList.add('hidden');
      dom.detailContent.classList.remove('hidden');
    } catch (err) {
      alert('詳細提案の生成中にエラーが発生しました:\n' + err.message);
      showStep('usecases');
    }
  }

  function handleExport() {
    if (!state.selectedUseCase || !state.detailProposal) return;

    const proposal = state.detailProposal;
    const uc = state.selectedUseCase;
    const contextLabel = state.inputType === 'challenge' ? '課題' : 'ゴール';
    const context = state.inputType === 'challenge' ? state.challenge : state.goal;

    let text = `========================================\n`;
    text += `インタラクティブ動画 提案書\n`;
    text += `========================================\n\n`;
    text += `■ クライアント情報\n`;
    text += `  業界: ${state.industry}\n`;
    text += `  商材・サービス: ${state.product}\n`;
    text += `  ${contextLabel}: ${context}\n\n`;
    text += `■ 選択ユースケース\n`;
    text += `  ${uc.title}\n`;
    text += `  ${uc.summary}\n\n`;

    text += `----------------------------------------\n`;
    text += `■ 動画シナリオ\n`;
    text += `----------------------------------------\n`;
    text += `概要: ${proposal.scenario.overview}\n`;
    text += `想定動画尺: ${proposal.scenario.duration}\n\n`;

    if (proposal.scenario.scenes) {
      proposal.scenario.scenes.forEach((scene) => {
        text += `[シーン${scene.sceneNumber}] ${scene.title}（${scene.duration}）\n`;
        text += `  内容: ${scene.description}\n`;
        text += `  インタラクション: ${scene.interaction}\n\n`;
      });
    }

    if (proposal.scenario.branchingPoints) {
      text += `分岐ポイント: ${proposal.scenario.branchingPoints}\n\n`;
    }

    text += `----------------------------------------\n`;
    text += `■ 想定される課題\n`;
    text += `----------------------------------------\n`;
    if (proposal.challenges) {
      proposal.challenges.forEach((ch) => {
        text += `● ${ch.title}\n`;
        text += `  ${ch.description}\n`;
        text += `  対策: ${ch.mitigation}\n\n`;
      });
    }

    text += `----------------------------------------\n`;
    text += `■ 想定される結果\n`;
    text += `----------------------------------------\n`;
    if (proposal.results) {
      proposal.results.forEach((r) => {
        text += `● ${r.metric}\n`;
        text += `  現状: ${r.currentEstimate} → 改善後: ${r.expectedImprovement}\n`;
        text += `  ${r.description}\n\n`;
      });
    }

    text += `----------------------------------------\n`;
    text += `■ 想定ROI\n`;
    text += `----------------------------------------\n`;
    if (proposal.roi) {
      text += `ROI: ${proposal.roi.roiPercentage}\n`;
      text += `投資回収期間: ${proposal.roi.paybackPeriod}\n`;
      text += `投資概算: ${proposal.roi.investmentEstimate}\n`;
      text += `期待リターン: ${proposal.roi.expectedReturn}\n`;
      text += `前提条件: ${proposal.roi.assumptions}\n`;
      if (proposal.roi.additionalBenefits) {
        text += `\n副次的な効果:\n`;
        proposal.roi.additionalBenefits.forEach((b) => {
          text += `  - ${b}\n`;
        });
      }
    }

    text += `\n========================================\n`;
    text += `生成日時: ${new Date().toLocaleString('ja-JP')}\n`;
    text += `Powered by インタラクティブ動画 提案AIアシスタント\n`;

    // Download
    const blob = new Blob([text], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `提案書_${uc.title}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ========================================
  // Utilities
  // ========================================
  function setGenerateLoading(loading) {
    const btnText = dom.generateBtn.querySelector('.btn-text');
    const btnLoading = dom.generateBtn.querySelector('.btn-loading');

    if (loading) {
      btnText.classList.add('hidden');
      btnLoading.classList.remove('hidden');
      dom.generateBtn.disabled = true;
    } else {
      btnText.classList.remove('hidden');
      btnLoading.classList.add('hidden');
      dom.generateBtn.disabled = false;
    }
  }

  function showStatus(el, message, type) {
    el.textContent = message;
    el.className = 'status-message ' + type;
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ========================================
  // Initialize
  // ========================================
  function init() {
    loadApiKey();

    // API Key
    dom.saveKeyBtn.addEventListener('click', saveApiKey);
    dom.toggleKeyBtn.addEventListener('click', toggleKeyVisibility);

    // Form
    handleInputTypeChange();
    handleIndustryChange();
    dom.inputForm.addEventListener('submit', handleFormSubmit);

    // Navigation
    dom.backToInputBtn.addEventListener('click', () => showStep('input'));
    dom.backToUsecasesBtn.addEventListener('click', () => showStep('usecases'));
    dom.regenerateBtn.addEventListener('click', () => handleFormSubmit(new Event('submit')));

    // Export
    dom.exportBtn.addEventListener('click', handleExport);
  }

  // Start
  init();
})();
