const { resizer } = require('@100jm/image-resizer');
const fs = require('fs').promises;
const path = require('path');

async function testCJSResizer() {
    try {
        console.log('=== Node.js CJS 방식 이미지 리사이저 테스트 ===\n');
        
        // 테스트 이미지 파일 경로
        const imagePath = path.join(__dirname, 'tests', 'fixtures', 'test-image.jpg');
        
        // 이미지 파일 존재 확인
        try {
            await fs.access(imagePath);
            console.log('테스트 이미지 파일 확인됨:', imagePath);
        } catch (error) {
            console.error('테스트 이미지 파일을 찾을 수 없습니다:', imagePath);
            return;
        }
        
        // 이미지 파일 읽기
        console.log('이미지 파일 읽는 중...');
        const imageBuffer = await fs.readFile(imagePath);
        console.log('이미지 파일 로드 완료');
        console.log('원본 파일 크기:', (imageBuffer.length / 1024).toFixed(2), 'KB');
        
        // 다양한 크기로 리사이즈 테스트
        const testCases = [
            { width: 400, height: 300, name: '중간 크기' },
            { width: 100, height: 100, name: '작은 크기' },
            { width: 800, height: 600, name: '큰 크기' },
            { width: 200, height: 300, name: '세로형' }
        ];
        
        for (const testCase of testCases) {
            console.log(`\n ${testCase.name} 테스트 (${testCase.width}x${testCase.height})`);
            
            const startTime = Date.now();
            
            // 이미지 리사이즈
            const result = await resizer(imageBuffer, testCase.width, testCase.height, {
                quality: 0.8,
                format: 'jpeg'
            });
            
            const endTime = Date.now();
            const processingTime = endTime - startTime;
            
            console.log('리사이즈 완료!');
            console.log(`새 크기: ${result.width} x ${result.height}`);
            console.log(`원본 크기: ${result.originalWidth} x ${result.originalHeight}`);
            console.log(`결과 파일 크기: ${(result.data.size / 1024).toFixed(2)} KB`);
            console.log(`처리 시간: ${processingTime}ms`);
            
            // 결과 이미지 저장
            const outputPath = path.join(__dirname, `resized-${testCase.width}x${testCase.height}.jpg`);
            const arrayBuffer = await result.data.arrayBuffer();
            await fs.writeFile(outputPath, Buffer.from(arrayBuffer));
            console.log(`결과 이미지 저장됨: ${outputPath}`);
        }
        
        // 품질 설정 테스트
        console.log('\n 품질 설정 테스트');
        const qualityTests = [
            { quality: 0.1, name: '낮은 품질' },
            { quality: 0.5, name: '중간 품질' },
            { quality: 0.9, name: '높은 품질' }
        ];
        
        for (const qualityTest of qualityTests) {
            const result = await resizer(imageBuffer, 300, 200, {
                quality: qualityTest.quality,
                format: 'jpeg'
            });
            
            console.log(`${qualityTest.name} (${qualityTest.quality}): ${(result.data.size / 1024).toFixed(2)} KB`);
        }
        
        // 포맷 테스트
        console.log('\n 포맷 테스트');
        const formatTests = [
            { format: 'jpeg', name: 'JPEG' },
            { format: 'png', name: 'PNG' },
            { format: 'webp', name: 'WebP' }
        ];
        
        for (const formatTest of formatTests) {
            try {
                const result = await resizer(imageBuffer, 300, 200, {
                    quality: 0.8,
                    format: formatTest.format
                });
                
                console.log(`${formatTest.name}: ${(result.data.size / 1024).toFixed(2)} KB`);
            } catch (error) {
                console.log(`${formatTest.name}: 지원되지 않음`);
            }
        }
        
        console.log('\n 모든 CJS 테스트 완료!');
        
    } catch (error) {
        console.error('테스트 실패:', error);
        console.error('스택 트레이스:', error.stack);
    }
}

// 환경 정보 출력
console.log('Node.js 환경 정보:');
console.log('Node.js 버전:', process.version);
console.log('플랫폼:', process.platform);
console.log('아키텍처:', process.arch);
console.log('현재 디렉토리:', __dirname);
console.log('');

// 테스트 실행
testCJSResizer();