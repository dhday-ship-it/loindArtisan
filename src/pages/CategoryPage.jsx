import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Header } from '../components/Header.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import { categories, categoryBySlug, CATEGORY_PROCESS_STEPS, DESIGN_GROUPS, findDesignGroup, API_BASE } from '../data.js'
import '../work.css'
import '../category.css'

function formatPrice(price, work) {
  if (price == null) return '상담 후 안내'
  // 쇼핑몰 '상품가'가 아니라 '기준가(시작가)'임을 드러낸다 — 사양에 따라 상담 후 확정.
  const suffix = work?.category === '사진 촬영' ? '원~ / 시간' : '원~'
  return `기준가 ${price.toLocaleString()}${suffix}`
}

export function CategoryPage() {
  const { slug, workId } = useParams()
  return <CategoryPageInner key={slug} slug={slug} initialWorkId={workId} />
}

function CategoryPageInner({ slug, initialWorkId }) {
  // URL slug은 '최초 분야'로만 쓴다. 이후 분야 전환은 의뢰서 안에서 activeSlug로 처리.
  const [activeSlug, setActiveSlug] = useState(categoryBySlug[slug] ? slug : 'custom')
  const category = categoryBySlug[activeSlug]
  const [allWorks, setAllWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(initialWorkId ?? null)
  const [designGroup, setDesignGroup] = useState(null) // 디자인 분야에서 선택된 그룹

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [churchName, setChurchName] = useState('')
  const [requestText, setRequestText] = useState('')
  const [referenceFile, setReferenceFile] = useState(null)
  const [referenceFileUrl, setReferenceFileUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  // 결과물 선택: 'DIGITAL'(파일만) | 'PHYSICAL'(실물 제작·배송)
  const [deliveryMode, setDeliveryMode] = useState('DIGITAL')
  const [shippingAddress, setShippingAddress] = useState('')
  const [addEditing, setAddEditing] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [completedOrder, setCompletedOrder] = useState(null)

  const { token, customer } = useAuth()

  useEffect(() => {
    if (!customer) return
    setCustomerName((prev) => prev || customer.name)
    setCustomerPhone((prev) => prev || customer.phone)
    setCustomerEmail((prev) => prev || customer.email)
    if (customer.churchName) setChurchName((prev) => prev || customer.churchName)
  }, [customer])

  useEffect(() => {
    let cancelled = false
    fetch(`${API_BASE}/api/artisan-works`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return
        setAllWorks(Array.isArray(data?.works) ? data.works : [])
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const isCustomCategory = activeSlug === 'custom'
  const isDesign = activeSlug === 'design'
  const customWork = allWorks.find((w) => w.category === '커스텀작업 신청') ?? null
  // 현재 분야의 전체 품목
  const categoryWorks = isCustomCategory
    ? []
    : allWorks.filter((w) => category && w.category === category.label)
  // 디자인은 그룹을 고른 뒤 그 그룹의 품목만 보여준다. (그룹 미선택이면 빈 목록)
  const works = isDesign
    ? (designGroup ? categoryWorks.filter((w) => findDesignGroup(w.title) === designGroup) : [])
    : categoryWorks

  // 품목(selectedId)이나 분야가 바뀌면 결과물 선택을 '파일만'으로 되돌린다.
  useEffect(() => {
    setDeliveryMode('DIGITAL')
  }, [selectedId, activeSlug])

  // 품목이 하나뿐일 때는 고를 것 없이 자동 선택한다.
  // (사진·굿즈처럼 분야에 1개, 또는 디자인 그룹 안에 1개)
  useEffect(() => {
    if (isCustomCategory || !category) return
    if (isDesign && !designGroup) return // 디자인은 그룹 먼저
    if (works.length === 1) setSelectedId(works[0].id)
  }, [activeSlug, designGroup, allWorks]) // eslint-disable-line react-hooks/exhaustive-deps

  // 분야를 바꾼다 (품목·그룹 선택 초기화)
  const changeCategory = (nextSlug) => {
    setActiveSlug(nextSlug)
    setSelectedId(null)
    setDesignGroup(null)
  }

  const changeDesignGroup = (groupId) => {
    setDesignGroup(groupId)
    setSelectedId(null)
  }

  const selectedWork = works.find((w) => w.id === selectedId) ?? null
  const targetWork = isCustomCategory ? customWork : selectedWork
  const processSteps = !isCustomCategory ? (CATEGORY_PROCESS_STEPS[category?.label] ?? []) : []
  const isVideo = targetWork?.category === '영상'
  const isPhoto = targetWork?.category === '사진 촬영'
  const isWeb = targetWork?.category === '홈페이지,웹'
  const isGoods = targetWork?.category === '굿즈,기념품 제작'

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setReferenceFile(file)
    setReferenceFileUrl(null)
    setUploadError(null)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(`${API_BASE}/api/artisan-orders/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        setUploadError(data.error ?? '파일을 올리지 못했어요. 다시 시도해주세요.')
        return
      }
      setReferenceFileUrl(data.url)
    } catch {
      setUploadError('파일을 올리지 못했어요. 다시 시도해주세요.')
    } finally {
      setUploading(false)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!targetWork) {
      setError('어떤 작업을 원하시는지 먼저 골라주세요.')
      return
    }
    if (!customerName || !customerPhone || !requestText) {
      setError('성함, 연락처, 원하시는 내용은 꼭 적어주세요.')
      return
    }
    const wantsPhysical = targetWork.supportsPrint && deliveryMode === 'PHYSICAL'
    if (wantsPhysical && !shippingAddress.trim()) {
      setError('실물로 받으시려면 보내드릴 주소가 필요해요.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/api/artisan-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          workId: targetWork.id,
          customerName,
          customerPhone,
          customerEmail: customerEmail || undefined,
          churchName: churchName || undefined,
          requestText,
          referenceFileUrl: referenceFileUrl || undefined,
          wantsEditing: isVideo && targetWork.title === '촬영' ? addEditing : undefined,
          deliveryType: wantsPhysical ? 'PHYSICAL' : 'DIGITAL',
          shippingAddress: wantsPhysical ? shippingAddress.trim() : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? '접수가 잘 안 됐어요. 잠시 후 다시 해주시겠어요?')
        return
      }
      setCompletedOrder(data.order)
    } catch {
      setError('접수가 잘 안 됐어요. 잠시 후 다시 해주시겠어요?')
    } finally {
      setSubmitting(false)
    }
  }

  return <div className="site-shell" id="top">
    <Header />
    <main>
      {completedOrder ? (
        <section className="order-complete">
          <p className="order-complete-badge">접수 완료</p>
          <h1>잘 받았어요. 고맙습니다!</h1>
          <p>담당 작업팀이 내용을 확인하고 순서대로 시작할게요. 진행 상황은 남겨주신 연락처로 알려드릴게요.</p>
          <p className="order-complete-id">접수번호 {completedOrder.id}</p>
          {customer
            ? <Link to="/my" className="dark-button">내 의뢰 내역 보기 <b>↗</b></Link>
            : <Link to="/" className="dark-button">홈으로 돌아가기 <b>↗</b></Link>}
        </section>
      ) : (
        <section className="order-page">
          {loading && <p className="category-empty">불러오는 중...</p>}

          {!loading && <>
            <div className="order-layout">
              {/* ── 왼쪽: 입력 폼 ── */}
              <form className="order-main" onSubmit={submit}>
                {/* 헤더를 카드 안으로 */}
                <header className="order-head">
                  <h1>무엇을 만들어 드릴까요?</h1>
                  <p className="order-head-sub">원하시는 걸 편하게 알려주세요. 결제가 아니라 상담부터 시작해요.</p>
                </header>

                {/* 0. 분야 선택 */}
                <section className="order-block">
                  <h2 className="order-block-title">분야</h2>
                  <div className="order-cat-tabs">
                    {categories.map((c) => (
                      <button
                        key={c.slug}
                        type="button"
                        className={c.slug === activeSlug ? 'order-cat-tab active' : 'order-cat-tab'}
                        onClick={() => changeCategory(c.slug)}
                      >
                        <img src={c.icon} alt="" />
                        <span>{c.label}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* 디자인 그룹 선택 (디자인 분야에서만) */}
                {isDesign && (
                  <section className="order-block order-block--item">
                    <h2 className="order-block-title">어떤 종류의 디자인인가요?</h2>
                    <div className="order-chip-group">
                      {DESIGN_GROUPS.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          className={g.id === designGroup ? 'order-chip order-chip--group active' : 'order-chip order-chip--group'}
                          onClick={() => changeDesignGroup(g.id)}
                        >
                          <span className="order-chip-label">{g.label}</span>
                          <span className="order-chip-desc">{g.desc}</span>
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                {/* 1. 품목 선택 — 품목이 여럿일 때만 보여준다 (1개면 자동 선택되어 생략) */}
                {isDesign && !designGroup ? null : isCustomCategory ? (
                  <section className="order-block order-block--item">
                    <h2 className="order-block-title">어떤 작업이 필요하세요?</h2>
                    <p className="order-note">{customWork?.description || customWork?.text || '딱 맞는 항목이 없어도 괜찮아요. 원하시는 걸 아래에 편하게 적어주시면 저희가 맞춰드릴게요.'}</p>
                  </section>
                ) : works.length === 0 ? (
                  <section className="order-block order-block--item">
                    <h2 className="order-block-title">어떤 작업이 필요하세요?</h2>
                    <p className="order-note">이 분야는 지금 준비하고 있어요. 다른 분야를 먼저 둘러보시겠어요?</p>
                  </section>
                ) : works.length > 1 ? (
                  <section className="order-block order-block--item">
                    <h2 className="order-block-title">어떤 작업이 필요하세요?</h2>
                    <div className="order-chip-group">
                      {works.map((w) => (
                        <button
                          key={w.id}
                          type="button"
                          className={w.id === selectedId ? 'order-chip active' : 'order-chip'}
                          onClick={() => setSelectedId(w.id)}
                        >
                          {w.title}
                        </button>
                      ))}
                    </div>
                  </section>
                ) : null}

                {!targetWork && !isCustomCategory && works.length > 1 && (!isDesign || designGroup) && (
                  <p className="order-note">원하시는 작업을 골라주시면, 그다음은 저희가 하나씩 여쭤볼게요.</p>
                )}

                {targetWork && <>
                  {/* 2. 결과물 선택 */}
                  {targetWork.supportsPrint && (
                    <section className="order-block order-reveal">
                      <h2 className="order-block-title">어떻게 받으실래요?</h2>
                      <div className="delivery-choice">
                        <button
                          type="button"
                          className={deliveryMode === 'DIGITAL' ? 'delivery-option active' : 'delivery-option'}
                          onClick={() => setDeliveryMode('DIGITAL')}
                        >
                          <span className="delivery-option-mark" />
                          <span className="delivery-option-copy">
                            <span className="delivery-option-title">디자인 파일로 받을게요</span>
                            <span className="delivery-option-sub">바로 쓸 수 있게 파일로 보내드려요</span>
                          </span>
                        </button>
                        <button
                          type="button"
                          className={deliveryMode === 'PHYSICAL' ? 'delivery-option active' : 'delivery-option'}
                          onClick={() => setDeliveryMode('PHYSICAL')}
                        >
                          <span className="delivery-option-mark" />
                          <span className="delivery-option-copy">
                            <span className="delivery-option-title">실물로 만들어 받을게요</span>
                            <span className="delivery-option-sub">인쇄·제작부터 배송까지 저희가 다 할게요</span>
                          </span>
                        </button>
                      </div>
                      {deliveryMode === 'PHYSICAL' && (
                        <label className="order-form-shipping">
                          <span>어디로 보내드릴까요? *</span>
                          <textarea
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            placeholder="받으실 주소와 받는 분 성함·연락처를 적어주세요."
                            rows={2}
                          />
                        </label>
                      )}
                    </section>
                  )}

                  {/* 영상 촬영 → 편집 추가 */}
                  {isVideo && targetWork.title === '촬영' && (
                    <section className="order-block">
                      <h2 className="order-block-title">추가 서비스</h2>
                      <label className={addEditing ? 'toggle-card active' : 'toggle-card'}>
                        <span className="toggle-card-icon">✂️</span>
                        <span className="toggle-card-copy">
                          <span className="toggle-card-title">편집도 같이 맡길게요</span>
                          <span className="toggle-card-sub">촬영한 영상을 편집까지 깔끔하게 마무리해드려요</span>
                        </span>
                        <span className="switch">
                          <input type="checkbox" checked={addEditing} onChange={(e) => setAddEditing(e.target.checked)} />
                          <span className="switch-track"><span className="switch-thumb" /></span>
                        </span>
                      </label>
                    </section>
                  )}

                  {/* 3. 요청 내용 */}
                  <section className="order-block order-reveal">
                    <h2 className="order-block-title">어떤 걸 원하시는지 들려주세요</h2>
                    <p className="order-block-sub">정해진 형식 없어요. 생각나는 대로 편하게 적어주시면 돼요.</p>
                    <div className="order-fields">
                      <label className="order-field-full">
                        <textarea
                          value={requestText}
                          onChange={(e) => setRequestText(e.target.value)}
                          placeholder={
                            isVideo
                              ? '예: 다음 달 수련회 촬영이요. 3/15 ○○교회 본당, 2시간 정도 생각하고 있어요. 참고 영상 링크도 같이 적어주시면 좋아요.'
                              : isPhoto
                              ? '예: 임직식 단체사진이요. 3/15 오후 2시 본당, 60명쯤 돼요.'
                              : isWeb
                              ? '예: 교회 공식 홈페이지요. 소개·설교·오시는길 메뉴가 필요하고, 참고하고 싶은 사이트가 있으면 링크도 적어주세요.'
                              : isGoods
                              ? '예: 수련회 단체 티셔츠 50장이요. 로고는 있고, 5월 초까지 필요해요.'
                              : targetWork?.title === '명함'
                              ? '예: 담임목사님 명함이요. 성함·직책·연락처 넣고, 로고 있어요. 깔끔한 느낌이면 좋겠어요.'
                              : '예: 들어갈 문구, 크기, 원하는 날짜나 느낌 등 떠오르는 대로 편하게 적어주세요.'
                          }
                        />
                      </label>

                      <label className="order-field-full order-field-file">
                        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif,application/pdf" onChange={handleFileChange} />
                        <span className="order-field-file-hint">참고 이미지가 있으면 올려주세요 (선택)</span>
                        {uploading && <span className="order-form-upload-status">올리는 중...</span>}
                        {referenceFileUrl && !uploading && <span className="order-form-upload-status is-done">올렸어요: {referenceFile?.name}</span>}
                        {uploadError && <p className="order-form-error">{uploadError}</p>}
                      </label>
                    </div>
                  </section>

                  {/* 4. 연락처 */}
                  <section className="order-block order-reveal">
                    <h2 className="order-block-title">어디로 연락드릴까요?</h2>
                    <div className="order-fields order-fields--grid">
                      <label>
                        <span>소속 <em>(선택)</em></span>
                        <input value={churchName} onChange={(e) => setChurchName(e.target.value)} placeholder="예: ○○교회" />
                      </label>
                      <label>
                        <span>성함 *</span>
                        <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="홍길동" />
                      </label>
                      <label>
                        <span>연락처 *</span>
                        <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="010-0000-0000" />
                      </label>
                      <label>
                        <span>이메일 <em>(선택)</em></span>
                        <input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="연락받으실 이메일" type="email" />
                      </label>
                    </div>
                  </section>
                </>}
              </form>

              {/* ── 오른쪽: 요약 (짙은 네이비) ── */}
              {targetWork && (
                <aside className="order-summary">
                  <div className="order-summary-card">
                    <p className="order-summary-label">이렇게 요청하실게요</p>
                    <dl className="order-summary-list">
                      <div><dt>분야</dt><dd>{isCustomCategory ? '커스텀작업 신청' : category?.label} · {targetWork.title}</dd></div>
                      {targetWork.supportsPrint && (
                        <div><dt>받는 방법</dt><dd>{deliveryMode === 'PHYSICAL' ? '실물로 제작·배송' : '디자인 파일로'}</dd></div>
                      )}
                      <div><dt>기준가</dt><dd>{formatPrice(targetWork.price, targetWork)}</dd></div>
                    </dl>

                    {processSteps.length > 0 && (
                      <p className="order-summary-steps">{processSteps.join(' › ')}</p>
                    )}

                    <p className="order-summary-note">정확한 금액은 내용을 확인한 뒤 담당자가 따로 안내드려요. 지금 결제되는 건 아니니 편하게 신청하세요.</p>

                    {error && <p className="order-summary-error">{error}</p>}

                    <button
                      type="button"
                      disabled={submitting || uploading}
                      className="order-summary-submit"
                      onClick={submit}
                    >
                      {submitting ? '보내는 중...' : uploading ? '파일 올리는 중...' : '이대로 의뢰할게요'}
                    </button>
                  </div>
                </aside>
              )}
            </div>
          </>}
        </section>
      )}
    </main>
  </div>
}
