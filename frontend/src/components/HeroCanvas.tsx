import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroCanvas() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current!;
        const w = mount.clientWidth, h = mount.clientHeight;

        // Scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
        camera.position.z = 22;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        // Chakra (spinning wheel) — represents the Sudarshana Chakra
        const chakraGroup = new THREE.Group();
        const rimGeo = new THREE.TorusGeometry(7, 0.15, 16, 80);
        const rimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.6, metalness: 0.9, roughness: 0.1 });
        chakraGroup.add(new THREE.Mesh(rimGeo, rimMat));

        // Spokes
        for (let i = 0; i < 12; i++) {
            const spokeGeo = new THREE.CylinderGeometry(0.06, 0.06, 7, 8);
            const spoke = new THREE.Mesh(spokeGeo, rimMat);
            spoke.rotation.z = (i / 12) * Math.PI * 2;
            spoke.position.set(Math.sin((i / 12) * Math.PI * 2) * 3.5, Math.cos((i / 12) * Math.PI * 2) * 3.5, 0);
            chakraGroup.add(spoke);
        }

        // Hub
        const hubGeo = new THREE.SphereGeometry(1, 32, 32);
        const hubMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xfbbf24, emissiveIntensity: 0.8, metalness: 1, roughness: 0 });
        chakraGroup.add(new THREE.Mesh(hubGeo, hubMat));

        chakraGroup.position.set(5, 0, -5);
        chakraGroup.rotation.x = 0.3;
        scene.add(chakraGroup);

        // Floating particles
        const particleGeo = new THREE.BufferGeometry();
        const count = 800;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 60;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({ color: 0x6366f1, size: 0.12, transparent: true, opacity: 0.6 });
        scene.add(new THREE.Points(particleGeo, particleMat));

        // Ambient + point lights
        scene.add(new THREE.AmbientLight(0x334155, 2));
        const pointLight = new THREE.PointLight(0x6366f1, 3, 50);
        pointLight.position.set(-10, 5, 10);
        scene.add(pointLight);
        const goldLight = new THREE.PointLight(0xf59e0b, 4, 40);
        goldLight.position.set(8, -3, 5);
        scene.add(goldLight);

        // Animation
        let frame: number;
        const clock = new THREE.Clock();
        const animate = () => {
            frame = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            chakraGroup.rotation.z += 0.004;
            chakraGroup.position.y = Math.sin(t * 0.5) * 0.6;
            goldLight.intensity = 3 + Math.sin(t * 2) * 1;
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            const nw = mount.clientWidth, nh = mount.clientHeight;
            camera.aspect = nw / nh;
            camera.updateProjectionMatrix();
            renderer.setSize(nw, nh);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}
