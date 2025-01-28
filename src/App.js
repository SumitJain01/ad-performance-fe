import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaHeart } from 'react-icons/fa';


const Container = styled.div`
    min-height: 100vh;
    background-color: #f9fafb;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
`;

const Card = styled.div`
    width: 100%;
    max-width: 80rem;
    background: #ffffff;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 32px;
`;

const Title = styled.h1`
    font-size: 1.875rem;
    font-weight: 800;
    color: #1f2937;
    text-align: center;
    margin-bottom: 36px;
`;

const Label = styled.label`
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
`;

const Input = styled.input`
    width: 98%;
    font-size: 0.875rem;
    color: #374151;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    padding: 8px 12px;
    &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    }
`;

const Button = styled.button`
    width: 100%;
    padding: 16px;
    font-size: 1rem;
    font-weight: 600;
    color: #ffffff;
    background-color: ${(props) => (props.disabled ? '#d1d5db' : '#2563eb')};
    border: none;
    border-radius: 0.5rem;
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    transition: background-color 0.2s;

    &:hover {
        background-color: ${(props) => (!props.disabled ? '#1d4ed8' : '#d1d5db')};
    }
`;

const Results = styled.pre`
    background-color: #f3f4f6;
    font-size: 0.875rem;
    color: #374151;
    padding: 16px;
    border-radius: 0.5rem;
    overflow-y: auto;  
`;
const Footer = styled.footer`
    width: 100%;
    text-align: center;
    padding: 16px;
    background-color: #f3f4f6;
    color: #374151;
    position: fixed;
    bottom: 0;
    left: 0;
`;
const App = () => {
    const [file, setFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadFile = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            const uploadResponse = await axios.post('http://localhost:5000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const filePath = uploadResponse.data.filePath;

            const analysisResponse = await axios.post('http://localhost:5000/analyze', { filePath });
            setAnalysis(analysisResponse.data);
        } catch (error) {
            console.error('Error uploading/analyzing file', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Card>
                <Title>Ad Performance Analyzer</Title>

                {!analysis ? (
                    <div>
                        <div style={{ marginBottom: '16px' }}>
                            <Label htmlFor="fileInput">Upload a CSV file</Label>
                            <Input
                                id="fileInput"
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                            />
                        </div>
                        <Button onClick={uploadFile} disabled={!file || loading}>
                            {loading ? 'Processing...' : 'Upload & Analyze'}
                        </Button>
                    </div>
                ) : (
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '16px' }}>
                            Analysis Results
                        </h2>
                        <Results>{analysis}</Results>
                        <Button onClick={() => setAnalysis(null)} style={{ marginTop: '24px' }}>
                            Upload Another File
                        </Button>
                    </div>
                )}
            </Card>
            <Footer>
                Developed with <FaHeart style={{ color: 'red' }} /> by Sumit Jain
            </Footer>
        </Container>
    );
};

export default App;
