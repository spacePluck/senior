# Phase 3 - 개발 가이드
## AI, IoT, 블록체인 통합

> **목적**: Phase 3 개발 시 추가되는 고급 기술 스택 및 연동 가이드

---

## Phase 3 추가 기술 스택

### AI/ML
```json
{
  "컴퓨터비전": "EverEx AI SDK",
  "자연어처리": "OpenAI GPT-4 Turbo",
  "예측분석": "TensorFlow.js",
  "음성인식": "Web Speech API + Whisper"
}
```

### IoT
```json
{
  "프로토콜": "MQTT, CoAP",
  "플랫폼": "AWS IoT Core",
  "센서통합": "Zigbee, Z-Wave",
  "Edge": "Raspberry Pi"
}
```

### 블록체인
```json
{
  "플랫폼": "Hyperledger Fabric",
  "스마트컨트랙트": "Chaincode (Go)",
  "저장소": "IPFS"
}
```

### AR/VR
```json
{
  "AR": "AR.js, WebXR",
  "3D렌더링": "Three.js",
  "모바일AR": "ARCore (Android), ARKit (iOS)"
}
```

---

## EverEx AI SDK 연동

### 설치 및 초기화

```typescript
// npm install @everex/ai-sdk
import { EverExAI } from '@everex/ai-sdk';

const everexAI = new EverExAI({
  apiKey: process.env.EVEREX_API_KEY,
  region: 'ap-northeast-2'
});
```

### 동작 분석

```typescript
// 비디오에서 동작 분석
export const analyzeMovement = async (
  videoFile: File,
  exerciseType: string
) => {
  const analysis = await everexAI.analyze({
    video: videoFile,
    type: exerciseType,
    options: {
      landmarks: true,      // 신체 랜드마크 추출
      angles: true,         // 관절 각도 계산
      balance: true,        // 균형 분석
      feedback: 'realtime'  // 실시간 피드백
    }
  });

  return {
    accuracy: analysis.accuracy,
    keyPoints: analysis.landmarks,
    feedback: analysis.feedback,
    improvements: analysis.suggestions
  };
};
```

### 실시간 자세 교정

```typescript
// 웹캠에서 실시간 분석
export const useRealtimePostureAnalysis = () => {
  const [feedback, setFeedback] = useState<PostureFeedback | null>(null);

  useEffect(() => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 }
    });

    const analyzer = everexAI.createRealtimeAnalyzer({
      stream,
      exerciseType: 'single_leg_stand',
      onFrame: (analysis) => {
        setFeedback({
          posture: analysis.posture,
          balance: analysis.balance,
          corrections: analysis.corrections
        });
      }
    });

    analyzer.start();

    return () => analyzer.stop();
  }, []);

  return feedback;
};
```

---

## IoT 센서 통합

### MQTT 연결

```typescript
import mqtt from 'mqtt';

const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL, {
  clientId: `senior-app-${userId}`,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD
});

mqttClient.on('connect', () => {
  // 사용자별 토픽 구독
  mqttClient.subscribe(`home/${userId}/sensors/#`);
});

mqttClient.on('message', (topic, message) => {
  const data = JSON.parse(message.toString());

  if (topic.includes('/fall-sensor')) {
    handleFallDetection(data);
  } else if (topic.includes('/vital-signs')) {
    handleVitalSigns(data);
  }
});
```

### 센서 데이터 처리

```typescript
// 낙상 감지 센서
interface FallSensorData {
  timestamp: number;
  acceleration: { x: number; y: number; z: number };
  impact: number;
  fallDetected: boolean;
}

const handleFallDetection = async (data: FallSensorData) => {
  if (data.fallDetected && data.impact > 2.5) {
    // 낙상 감지!
    await supabase.from('fall_incidents').insert({
      user_id: userId,
      timestamp: new Date(data.timestamp),
      impact_level: data.impact,
      sensor_data: data
    });

    // 가족 및 응급 연락처에 즉시 알림
    await sendEmergencyAlert({
      type: 'fall_detected',
      severity: 'high',
      data
    });
  }
};

// 생체 신호 센서 (스마트 워치 등)
interface VitalSignsData {
  timestamp: number;
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  oxygenSaturation: number;
  temperature: number;
}

const handleVitalSigns = async (data: VitalSignsData) => {
  // DB 저장
  await supabase.from('vital_signs_log').insert({
    user_id: userId,
    timestamp: new Date(data.timestamp),
    heart_rate: data.heartRate,
    bp_systolic: data.bloodPressure.systolic,
    bp_diastolic: data.bloodPressure.diastolic,
    oxygen_saturation: data.oxygenSaturation,
    temperature: data.temperature
  });

  // 이상 징후 감지
  if (data.heartRate > 100 || data.heartRate < 50) {
    await sendAlert({
      type: 'abnormal_heart_rate',
      value: data.heartRate,
      severity: 'medium'
    });
  }
};
```

---

## 블록체인 (건강 기록)

### Hyperledger Fabric 체인코드

```go
// chaincode/healthrecord.go
package main

import (
    "encoding/json"
    "github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type HealthRecord struct {
    RecordID    string `json:"recordId"`
    UserID      string `json:"userId"`
    Timestamp   int64  `json:"timestamp"`
    DataType    string `json:"dataType"`
    Data        string `json:"data"`
    Hash        string `json:"hash"`
}

type SmartContract struct {
    contractapi.Contract
}

func (s *SmartContract) CreateHealthRecord(
    ctx contractapi.TransactionContextInterface,
    recordID string,
    userID string,
    dataType string,
    data string,
) error {
    record := HealthRecord{
        RecordID:  recordID,
        UserID:    userID,
        Timestamp: time.Now().Unix(),
        DataType:  dataType,
        Data:      data,
        Hash:      calculateHash(data),
    }

    recordJSON, err := json.Marshal(record)
    if err != nil {
        return err
    }

    return ctx.GetStub().PutState(recordID, recordJSON)
}

func (s *SmartContract) QueryHealthRecords(
    ctx contractapi.TransactionContextInterface,
    userID string,
) ([]*HealthRecord, error) {
    queryString := fmt.Sprintf(
        `{"selector":{"userId":"%s"}}`,
        userID,
    )

    resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
    if err != nil {
        return nil, err
    }
    defer resultsIterator.Close()

    var records []*HealthRecord
    for resultsIterator.HasNext() {
        queryResponse, err := resultsIterator.Next()
        if err != nil {
            return nil, err
        }

        var record HealthRecord
        err = json.Unmarshal(queryResponse.Value, &record)
        if err != nil {
            return nil, err
        }
        records = append(records, &record)
    }

    return records, nil
}
```

### Node.js SDK 사용

```typescript
import { Gateway, Wallets } from 'fabric-network';

// 건강 기록 저장
export const storeHealthRecord = async (
  userId: string,
  dataType: string,
  data: any
) => {
  const wallet = await Wallets.newFileSystemWallet('./wallet');
  const gateway = new Gateway();

  try {
    await gateway.connect(connectionProfile, {
      wallet,
      identity: userId,
      discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('healthchannel');
    const contract = network.getContract('healthrecord');

    const recordId = generateRecordId();
    const dataString = JSON.stringify(data);

    await contract.submitTransaction(
      'CreateHealthRecord',
      recordId,
      userId,
      dataType,
      dataString
    );

    return recordId;
  } finally {
    gateway.disconnect();
  }
};

// 건강 기록 조회
export const getHealthRecords = async (userId: string) => {
  const wallet = await Wallets.newFileSystemWallet('./wallet');
  const gateway = new Gateway();

  try {
    await gateway.connect(connectionProfile, {
      wallet,
      identity: userId,
      discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('healthchannel');
    const contract = network.getContract('healthrecord');

    const result = await contract.evaluateTransaction(
      'QueryHealthRecords',
      userId
    );

    return JSON.parse(result.toString());
  } finally {
    gateway.disconnect();
  }
};
```

---

## AR 안전 점검

### WebXR 사용

```typescript
// AR 세션 시작
export const startARSafetyCheck = async () => {
  if (!navigator.xr) {
    throw new Error('WebXR not supported');
  }

  const session = await navigator.xr.requestSession('immersive-ar', {
    requiredFeatures: ['hit-test', 'dom-overlay'],
    domOverlay: { root: document.getElementById('overlay') }
  });

  const gl = canvas.getContext('webgl', { xrCompatible: true });
  const xrRefSpace = await session.requestReferenceSpace('local');

  session.requestAnimationFrame(onXRFrame);
};

// AR 프레임 처리
const onXRFrame = (time, frame) => {
  const session = frame.session;
  const pose = frame.getViewerPose(xrRefSpace);

  if (pose) {
    // AI로 환경 분석
    analyzeEnvironment(frame).then(hazards => {
      // 위험 요소 표시
      hazards.forEach(hazard => {
        displayHazardMarker(hazard);
      });
    });
  }

  session.requestAnimationFrame(onXRFrame);
};

// 환경 분석 (AI)
const analyzeEnvironment = async (frame) => {
  const imageData = captureFrame(frame);

  const analysis = await fetch('/api/ai/analyze-safety', {
    method: 'POST',
    body: JSON.stringify({ image: imageData })
  }).then(res => res.json());

  return analysis.hazards;
  // [
  //   { type: 'slip_hazard', location: {...}, severity: 'high' },
  //   { type: 'obstacle', location: {...}, severity: 'medium' }
  // ]
};
```

---

## 음성 인터페이스

### Web Speech API + Whisper

```typescript
// 음성 인식 (STT)
export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'ko-KR';

    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript;
      setTranscript(text);
    };

    recognition.start();

    return () => recognition.stop();
  }, []);

  return transcript;
};

// 음성 합성 (TTS)
export const speak = (text: string, lang: string = 'ko-KR') => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9; // 천천히
  utterance.pitch = 1.1; // 약간 높은 톤

  speechSynthesis.speak(utterance);
};

// 음성 명령 처리
export const handleVoiceCommand = (command: string) => {
  if (command.includes('약 복용')) {
    router.push('/health/medication');
    speak('복약 관리 페이지로 이동합니다');
  } else if (command.includes('택시')) {
    router.push('/transport/taxi');
    speak('택시 호출 페이지로 이동합니다');
  } else if (command.includes('SOS') || command.includes('도와')) {
    triggerSOS();
    speak('긴급 호출을 시작합니다');
  }
};
```

---

## 예측 분석 (TensorFlow.js)

### 건강 위험 예측

```typescript
import * as tf from '@tensorflow/tfjs';

// 모델 로드
let model: tf.LayersModel;

export const loadPredictionModel = async () => {
  model = await tf.loadLayersModel('/models/health-risk/model.json');
};

// 건강 위험 예측
export const predictHealthRisk = async (
  vitalSigns: VitalSignsHistory[]
) => {
  // 데이터 전처리
  const features = preprocessVitalSigns(vitalSigns);
  const tensor = tf.tensor2d([features]);

  // 예측
  const prediction = model.predict(tensor) as tf.Tensor;
  const riskScore = await prediction.data();

  tensor.dispose();
  prediction.dispose();

  return {
    riskLevel: riskScore[0] > 0.7 ? 'high' : riskScore[0] > 0.3 ? 'medium' : 'low',
    score: riskScore[0],
    recommendations: generateRecommendations(riskScore[0])
  };
};

const preprocessVitalSigns = (data: VitalSignsHistory[]) => {
  // 최근 30일 데이터 정규화
  const features = [];

  // 혈압 평균
  const avgBP = data.reduce((sum, d) => sum + d.bp_systolic, 0) / data.length;
  features.push(avgBP / 200); // 정규화

  // 혈압 변동성
  const bpVariance = calculateVariance(data.map(d => d.bp_systolic));
  features.push(bpVariance / 100);

  // 심박수 평균 및 변동성
  // ... 기타 특성 추가

  return features;
};
```

---

## 환경 변수 (Phase 3 추가)

```env
# Phase 1-2 환경 변수 (기존)
...

# Phase 3 추가

# EverEx AI
EVEREX_API_KEY=xxx
EVEREX_API_URL=https://api.everex.ai

# K-DOC
KDOC_API_KEY=xxx
KDOC_CLINIC_ID=xxx

# DKSH
DKSH_API_KEY=xxx
DKSH_WAREHOUSE_ID=xxx

# IoT
MQTT_BROKER_URL=mqtts://xxx.amazonaws.com
MQTT_USERNAME=xxx
MQTT_PASSWORD=xxx

# AWS IoT Core
AWS_IOT_ENDPOINT=xxx.iot.ap-northeast-2.amazonaws.com
AWS_IOT_THING_NAME=senior-home-{user_id}

# Blockchain
HYPERLEDGER_PEER_URL=grpcs://peer.example.com:7051
HYPERLEDGER_CA_URL=https://ca.example.com:7054

# OpenAI (확장)
OPENAI_API_KEY=sk-xxx
OPENAI_ORG_ID=org-xxx
```

---

## 성능 최적화

### Edge Computing
```typescript
// Cloudflare Workers or AWS Lambda@Edge

// 이미지 분석을 Edge에서 처리
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/analyze-movement') {
      // Edge에서 간단한 전처리
      const preprocessed = await preprocessImage(request);

      // 본 서버로 전송
      return fetch(ORIGIN_SERVER + '/api/analyze', {
        method: 'POST',
        body: preprocessed
      });
    }

    return fetch(request);
  }
};
```

### 실시간 데이터 스트리밍
```typescript
// Server-Sent Events (SSE)
export async function GET(req: Request) {
  const stream = new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        const data = getCurrentVitalSigns();
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      }, 1000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}
```

---

## 배포 (Phase 3)

### Kubernetes 배포
```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: senior-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: senior-app
  template:
    metadata:
      labels:
        app: senior-app
    spec:
      containers:
      - name: app
        image: senior-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: EVEREX_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: everex-key
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

---

**작성일**: 2025-01-24
**버전**: 1.0
